import { describe, expect, it } from "vitest";
import { scanCvBuffer, validatedCvBuffer } from "@/lib/file-validation";

const MAX = 4 * 1024 * 1024;

describe("CV file validation", () => {
  it("accepts a structurally valid PDF and rejects a spoofed PDF", async () => {
    const valid = new File(
      [Buffer.from("%PDF-1.7\n1 0 obj\nendobj\n%%EOF")],
      "resume.pdf",
      { type: "application/pdf" },
    );
    const spoofed = new File([Buffer.from("not a pdf")], "resume.pdf", {
      type: "application/pdf",
    });

    expect(await validatedCvBuffer(valid, MAX)).toBeInstanceOf(Buffer);
    expect(await validatedCvBuffer(spoofed, MAX)).toBeNull();
  });

  it("accepts the OLE signature for legacy DOC files", async () => {
    const signature = Buffer.from([
      0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00,
    ]);
    const file = new File([signature], "resume.doc", {
      type: "application/msword",
    });

    expect(await validatedCvBuffer(file, MAX)).toBeInstanceOf(Buffer);
  });

  it("requires core DOCX entries and rejects macro containers", async () => {
    const valid = docxFile([
      "[Content_Types].xml",
      "_rels/.rels",
      "word/document.xml",
    ]);
    const macro = docxFile([
      "[Content_Types].xml",
      "_rels/.rels",
      "word/document.xml",
      "word/vbaProject.bin",
    ]);

    expect(await validatedCvBuffer(valid, MAX)).toBeInstanceOf(Buffer);
    expect(await validatedCvBuffer(macro, MAX)).toBeNull();
  });

  it("rejects mismatched filename extensions", async () => {
    const file = new File(
      [Buffer.from("%PDF-1.7\n%%EOF")],
      "resume.exe",
      { type: "application/pdf" },
    );
    expect(await validatedCvBuffer(file, MAX)).toBeNull();
  });

  it("records an unscanned upload when no scanner is configured", async () => {
    const previousEndpoint = process.env.CV_SCAN_ENDPOINT;
    const previousToken = process.env.CV_SCAN_TOKEN;
    delete process.env.CV_SCAN_ENDPOINT;
    delete process.env.CV_SCAN_TOKEN;

    const file = new File([Buffer.from("valid")], "resume.pdf", {
      type: "application/pdf",
    });

    try {
      expect(await scanCvBuffer(file, Buffer.from("valid"))).toBe(
        "notConfigured",
      );
    } finally {
      if (previousEndpoint === undefined) delete process.env.CV_SCAN_ENDPOINT;
      else process.env.CV_SCAN_ENDPOINT = previousEndpoint;
      if (previousToken === undefined) delete process.env.CV_SCAN_TOKEN;
      else process.env.CV_SCAN_TOKEN = previousToken;
    }
  });
});

function docxFile(entries: string[]) {
  const local = Buffer.alloc(4);
  local.writeUInt32LE(0x04034b50);
  const centralEntries = entries.map((name) => {
    const fileName = Buffer.from(name);
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(fileName.length, 28);
    return Buffer.concat([header, fileName]);
  });
  const bytes = Buffer.concat([local, ...centralEntries]);
  return new File([bytes], "resume.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
