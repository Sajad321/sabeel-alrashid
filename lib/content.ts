import type { Article, Branch, Brand, Job, LocalizedString, TeamMember } from "./types";

const l = (ar: string, en: string): LocalizedString => ({ ar, en });

export const brands: Brand[] = [
  {
    slug: "super-chicken",
    name: l("سوبر تشيكن", "Super Chicken"),
    category: l("مطاعم خدمة سريعة", "Quick-Service Restaurant"),
    description: l(
      "علامة الدجاج المقلي الأسرع نمواً في العراق، تشتهر بالنكهة الجريئة والخدمة السريعة والجودة المتّسقة.",
      "Iraq's fast-growing fried-chicken brand, known for bold flavour, friendly service and consistent quality.",
    ),
    logo: "/assets/brands/super-chicken-logo.png",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=80&auto=format&fit=crop",
    website: "https://www.superchicken-iq.com",
    gallery: [
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=700&q=75&auto=format&fit=crop",
    ].map((src) => ({
      src,
      alt: l("أطباق سوبر تشيكن", "Super Chicken food"),
    })),
    stats: [
      { value: "32", label: l("فرعاً", "Branches") },
      { value: "2017", label: l("منذ", "Since") },
      { value: "QSR", label: l("القطاع", "Segment") },
    ],
  },
  {
    slug: "alrukn",
    name: l("الركن الشرقي", "Alrukn Alsharqi"),
    category: l("ضيافة شرقية راقية", "Premium Eastern Dining"),
    description: l(
      "مفهوم ضيافة شرقي راقٍ للصالات، بمساحات أكبر وقاعدة عملاء وفيّة ومتكرّرة.",
      "A premium Eastern dine-in concept with generous spaces and a loyal, returning clientele.",
    ),
    logo: "/assets/brands/alrukn-logo.png",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80&auto=format&fit=crop",
    website: "https://www.instagram.com/alruknalsharqi.iq/",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=75&auto=format&fit=crop",
    ].map((src) => ({
      src,
      alt: l("أطباق الركن الشرقي", "Alrukn Alsharqi food"),
    })),
    stats: [
      { value: "13", label: l("فرعاً", "Branches") },
      { value: "2021", label: l("منذ", "Since") },
      { value: "Premium", label: l("القطاع", "Segment") },
    ],
  },
];

export const teamMembers: TeamMember[] = [
  { slug: "chairman", name: l("رئيس مجلس الإدارة", "Chairman"), role: l("المجلس والاستراتيجية", "Board & Strategy"), photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=75&auto=format&fit=crop" },
  { slug: "ceo", name: l("الرئيس التنفيذي", "Chief Executive Officer"), role: l("عمليات المجموعة", "Group Operations"), photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=75&auto=format&fit=crop" },
  { slug: "cfo", name: l("المدير المالي", "Chief Financial Officer"), role: l("المالية والاستثمار", "Finance & Investment"), photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=75&auto=format&fit=crop" },
  { slug: "coo", name: l("مدير العمليات", "Chief Operating Officer"), role: l("المطاعم والإمداد", "Restaurants & Supply"), photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=75&auto=format&fit=crop" },
];

export const branches: Branch[] = [
  {
    slug: "kadhimiya",
    brand: "super-chicken",
    side: l("الكرخ", "Karkh"),
    district: l("الكاظمية", "Kadhimiya"),
    lat: 33.379,
    lng: 44.337,
    x: 40,
    y: 34,
  },
  {
    slug: "harthiya",
    brand: "alrukn",
    side: l("الكرخ", "Karkh"),
    district: l("الحارثية", "Harthiya"),
    lat: 33.318,
    lng: 44.371,
    x: 55,
    y: 52,
  },
  {
    slug: "mansour",
    brand: "super-chicken",
    side: l("الكرخ", "Karkh"),
    district: l("المنصور", "Mansour"),
    lat: 33.312,
    lng: 44.357,
    x: 46,
    y: 56,
  },
  {
    slug: "adhamiyah",
    brand: "super-chicken",
    side: l("الرصافة", "Rusafa"),
    district: l("الأعظمية", "Adhamiyah"),
    lat: 33.365,
    lng: 44.368,
    x: 49,
    y: 38,
  },
  {
    slug: "zayouna",
    brand: "alrukn",
    side: l("الرصافة", "Rusafa"),
    district: l("زيونة", "Zayouna"),
    lat: 33.345,
    lng: 44.47,
    x: 70,
    y: 47,
  },
  {
    slug: "karrada",
    brand: "super-chicken",
    side: l("الرصافة", "Rusafa"),
    district: l("الكرادة", "Karrada"),
    lat: 33.308,
    lng: 44.408,
    x: 62,
    y: 61,
  },
  {
    slug: "east-karrada",
    brand: "alrukn",
    side: l("الرصافة", "Rusafa"),
    district: l("الكرادة الشرقية", "East Karrada"),
    lat: 33.301,
    lng: 44.422,
    x: 66,
    y: 66,
  },
  {
    slug: "jadriya",
    brand: "super-chicken",
    side: l("الرصافة", "Rusafa"),
    district: l("الجادرية", "Al-Jadriya"),
    lat: 33.279,
    lng: 44.388,
    x: 55,
    y: 69,
  },
];

const articleBodies = [
  l(
    "أعلنت مجموعة سبيل الراشد عن محطة جديدة ضمن مسيرة التوسّع، مدعومةً بمطبخ إنتاج مركزي وسلسلة إمداد متكاملة وفرق مدرّبة.",
    "Sabeel Al-Rashid announced a new milestone in its expansion, supported by a central production kitchen, an integrated supply chain and trained teams.",
  ),
  l(
    "تعكس الخطوة نموذج النمو المنضبط للمجموعة والتزامها بالجودة والخدمة والضيافة في كل موقع.",
    "The milestone reflects the group's disciplined growth model and its commitment to quality, service and hospitality at every location.",
  ),
];
export const articles: Article[] = [
  {
    slug: "super-chicken-32nd-branch",
    title: l(
      "سوبر تشيكن يفتتح فرعه الثاني والثلاثين",
      "Super Chicken opens its 32nd branch",
    ),
    excerpt: l(
      "محطة جديدة في مسيرة التوسّع السريع للعلامة في العراق.",
      "Another milestone in the brand's rapid expansion across Iraq.",
    ),
    body: articleBodies,
    category: l("توسّع", "Expansion"),
    categoryKey: "expansion",
    date: "2026-05-14",
    image:
      "https://www.superchicken-iq.com/wp-content/uploads/2025/04/Ken07.webp",
  },
  {
    slug: "central-kitchen",
    title: l(
      "مطبخٌ مركزيّ جديد يرفع الطاقة الإنتاجية",
      "New central kitchen increases production capacity",
    ),
    excerpt: l(
      "استثمار جديد في الجودة والتوسّع.",
      "A new investment in quality and scale.",
    ),
    body: articleBodies,
    category: l("عمليات", "Operations"),
    categoryKey: "operations",
    date: "2026-04-03",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "regional-franchise",
    title: l(
      "سبيل الراشد توقّع اتفاقية امتياز إقليمية",
      "Sabeel Al-Rashid signs a regional franchise deal",
    ),
    excerpt: l(
      "شراكة جديدة توسّع حضور المجموعة.",
      "A new partnership expands the group's footprint.",
    ),
    body: articleBodies,
    category: l("أعمال", "Business"),
    categoryKey: "business",
    date: "2026-03-18",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "alrukn-menu",
    title: l(
      "الركن الشرقي يكشف عن قائمةٍ مُجدّدة",
      "Alrukn Alsharqi unveils a refreshed menu",
    ),
    excerpt: l(
      "نكهات شرقية في تجربة جديدة.",
      "Eastern flavours in a renewed experience.",
    ),
    body: articleBodies,
    category: l("علاماتنا", "Brands"),
    categoryKey: "brands",
    date: "2026-02-12",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "group-crosses-45-branches",
    title: l("المجموعة تتجاوز ٤٥ فرعاً في المنطقة", "Group crosses 45 branches across the region"),
    excerpt: l("نموٌ جديد لمحفظة علامات المجموعة.", "A new growth milestone for the group's brand portfolio."),
    body: articleBodies,
    category: l("توسّع", "Expansion"), categoryKey: "expansion", date: "2026-01-20",
    image: "https://www.superchicken-iq.com/wp-content/uploads/2025/04/Bucket-1-scaled.webp",
  },
  {
    slug: "packaging-b2b-expansion",
    title: l("قطاع التعبئة يوسّع الإمداد للأعمال", "Packaging division expands B2B supply"),
    excerpt: l("طاقةٌ إضافية لخدمة شركاء الأعمال.", "Additional capacity to serve business partners."), body: articleBodies,
    category: l("عمليات", "Operations"), categoryKey: "operations", date: "2025-12-09",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "alrukn-zayouna-hall",
    title: l("الركن الشرقي يفتتح صالته الجديدة في زيونة", "Alrukn Alsharqi opens its new Zayouna dining hall"),
    excerpt: l("تجربة ضيافة شرقية جديدة في بغداد.", "A new Eastern dining experience in Baghdad."), body: articleBodies,
    category: l("علاماتنا", "Brands"), categoryKey: "brands", date: "2025-10-27",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "super-chicken-rice-menu",
    title: l("إطلاق قائمة الأرز الجديدة في سوبر تشيكن", "Super Chicken launches its new rice menu"),
    excerpt: l("وصفات جديدة تنضم إلى قائمة العلامة.", "New recipes join the brand's menu."), body: articleBodies,
    category: l("علاماتنا", "Brands"), categoryKey: "brands", date: "2025-08-15",
    image: "https://www.superchicken-iq.com/wp-content/uploads/2025/04/Rice-001.webp",
  },
  {
    slug: "central-kitchen-food-safety",
    title: l("المطبخ المركزي يحصل على شهادة سلامة الغذاء", "Central kitchen receives food-safety certification"),
    excerpt: l("اعتمادٌ جديد يعزّز أنظمة الجودة.", "A new certification strengthens quality systems."), body: articleBodies,
    category: l("عمليات", "Operations"), categoryKey: "operations", date: "2025-06-30",
    image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&q=80&auto=format&fit=crop",
  },
];

export const jobs: Job[] = [
  {
    slug: "restaurant-general-manager",
    title: l("مدير مطعم عام", "Restaurant General Manager"),
    department: l("العمليات", "Operations"),
    type: l("دوام كامل", "Full-time"),
    description: l(
      "قيادة فريق المطعم وتحقيق معايير التشغيل والجودة وتجربة الضيف.",
      "Lead the restaurant team and deliver operational, quality and guest-experience standards.",
    ),
  },
  {
    slug: "production-chef",
    title: l("شيف إنتاج — المطبخ المركزي", "Production Chef — Central Kitchen"),
    department: l("الإنتاج", "Production"),
    type: l("دوام كامل", "Full-time"),
    description: l(
      "إدارة الإنتاج اليومي وضمان الاتساق وسلامة الغذاء.",
      "Manage daily production while ensuring consistency and food safety.",
    ),
  },
  {
    slug: "marketing-specialist",
    title: l("أخصائي تسويق", "Marketing Specialist"),
    department: l("مؤسسي", "Corporate"),
    type: l("دوام كامل", "Full-time"),
    description: l(
      "تنفيذ الحملات وصناعة محتوى ينمّي حضور علاماتنا.",
      "Deliver campaigns and content that grow our brands.",
    ),
  },
  {
    slug: "supply-chain-coordinator",
    title: l("منسّق سلسلة الإمداد", "Supply Chain Coordinator"),
    department: l("التجارة", "Trade"),
    type: l("دوام كامل", "Full-time"),
    description: l(
      "تنسيق الموردين والمخزون والتوزيع عبر الشبكة.",
      "Coordinate suppliers, inventory and distribution across the network.",
    ),
  },
];

export const divisions = [
  {
    title: l("إدارة المطاعم", "Restaurant Management"),
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: l("إنتاج وتعبئة الأغذية", "Food Production & Packaging"),
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: l("التجارة العامة", "General Trade"),
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&q=80&auto=format&fit=crop",
  },
];
