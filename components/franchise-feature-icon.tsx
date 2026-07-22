export type FranchiseFeatureIconType = "badge" | "supply" | "support" | "economics" | "quality" | "growth";

export function FranchiseFeatureIcon({ type }: { type: FranchiseFeatureIconType }) {
  const cssType = type === "economics" ? "econ" : type;
  return <span className={`feature__ic fi-${cssType}`} aria-hidden="true"><svg viewBox="0 0 24 24">
    {type === "badge" && <path className="star" d="M12 3l2.3 4.6 5.1.7-3.7 3.6.9 5.1L12 14.8 7.4 17l.9-5.1L4.6 8.3l5.1-.7z" />}
    {type === "supply" && <><rect className="box" x="3" y="7" width="12" height="10" rx="1" /><path d="M15 10h3.5L21 13v4h-6" /><circle cx="7" cy="18.5" r="1.6" /><circle cx="17" cy="18.5" r="1.6" /></>}
    {type === "support" && <path className="gear" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />}
    {type === "economics" && <><line x1="4" y1="20" x2="20" y2="20" /><rect className="b1" x="6" y="11" width="3.2" height="9" /><rect className="b2" x="10.4" y="7" width="3.2" height="13" /><rect className="b3" x="14.8" y="13" width="3.2" height="7" /></>}
    {type === "quality" && <><path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" /><path className="chk" d="M9 12l2 2 4-4" /></>}
    {type === "growth" && <><path className="arr" d="M4 15l5-5 4 4 7-7" /><path className="arr" d="M16 7h4v4" /></>}
  </svg></span>;
}
