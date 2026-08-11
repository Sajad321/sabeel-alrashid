const PDF_MIME = "application/pdf";
const DOC_MIME = "application/msword";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const OLE_SIGNATURE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const ZIP_LOCAL_SIGNATURE = 0x04034b50;
const ZIP_CENTRAL_SIGNATURE = 0x02014b50;
const MAX_ZIP_ENTRIES = 2_048;
const MAX_UNCOMPRESSED_DOCX_BYTES = 100 * 1024 * 1024;

export async function validatedCvBuffer(file: File, maxBytes: number) {
  if (file.size <= 0 || file.size > maxBytes) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];

  if (file.type === PDF_MIME && extension === ".pdf")
    return isPdf(buffer) ? buffer : null;
  if (file.type === DOC_MIME && extension === ".doc")
    return buffer.subarray(0, OLE_SIGNATURE.length).equals(OLE_SIGNATURE)
      ? buffer
      : null;
  if (file.type === DOCX_MIME && extension === ".docx")
    return isSafeDocxContainer(buffer) ? buffer : null;

  return null;
}

export async function scanCvBuffer(file: File, buffer: Buffer) {
  const endpoint = process.env.CV_SCAN_ENDPOINT;
  const token = process.env.CV_SCAN_TOKEN;
  if (!endpoint?.startsWith("https://") || !token) return false;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/octet-stream",
        "x-file-name": encodeURIComponent(file.name),
        "x-file-mime": file.type,
      },
      body: new Uint8Array(buffer),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { clean?: boolean };
    return result.clean === true;
  } catch {
    return false;
  }
}

function isPdf(buffer: Buffer) {
  if (buffer.length < 8 || buffer.subarray(0, 5).toString("ascii") !== "%PDF-")
    return false;
  return buffer.subarray(Math.max(0, buffer.length - 2_048)).includes("%%EOF");
}

function isSafeDocxContainer(buffer: Buffer) {
  if (buffer.length < 4 || buffer.readUInt32LE(0) !== ZIP_LOCAL_SIGNATURE)
    return false;

  const entries = new Set<string>();
  let totalUncompressedBytes = 0;
  let entryCount = 0;

  for (let offset = 0; offset <= buffer.length - 46; offset++) {
    if (buffer.readUInt32LE(offset) !== ZIP_CENTRAL_SIGNATURE) continue;
    entryCount++;
    if (entryCount > MAX_ZIP_ENTRIES) return false;

    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const nameStart = offset + 46;
    const nameEnd = nameStart + fileNameLength;
    const nextOffset = nameEnd + extraLength + commentLength;
    if (nameEnd > buffer.length || nextOffset > buffer.length) return false;

    const name = buffer.subarray(nameStart, nameEnd).toString("utf8");
    if (
      !name ||
      name.includes("\0") ||
      name.startsWith("/") ||
      name.split("/").includes("..") ||
      name.toLowerCase().endsWith("vbaproject.bin")
    )
      return false;

    entries.add(name);
    totalUncompressedBytes += uncompressedSize;
    if (totalUncompressedBytes > MAX_UNCOMPRESSED_DOCX_BYTES) return false;
    offset = nextOffset - 1;
  }

  return (
    entryCount > 0 &&
    entries.has("[Content_Types].xml") &&
    entries.has("_rels/.rels") &&
    entries.has("word/document.xml")
  );
}
