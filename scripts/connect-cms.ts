import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-01",
  token,
  useCdn: false,
});

const l = (ar: string, en: string) => ({ ar, en });
const keyed = <T extends object>(items: T[], prefix: string) =>
  items.map((item, index) => ({
    _key: `${prefix}-${index}`,
    ...item,
  }));

const pages = {
  homePage: {
    title: l("الرئيسية", "Home"),
    introduction: {
      _type: "contentBlock",
      heading: l(
        "نمنح علامات الضيافة قوّةً للنمو.",
        "We give hospitality brands the muscle to grow.",
      ),
      body: l(
        "تأسّست سبيل الراشد عام ٢٠١٤، ونمت من مشروعٍ واحد إلى مجموعةٍ متكاملة تمتدّ عبر المطاعم وإنتاج الأغذية والتجارة العامة في عموم العراق.",
        "Founded in 2014, Sabeel Al-Rashid has grown from a single venture into an integrated group spanning restaurants, food production and general trade across Iraq.",
      ),
    },
    introductionFacts: keyed(
      [
        { _type: "stat", value: "2014", label: l("سنة التأسيس", "Established") },
        { _type: "stat", value: "3", label: l("قطاعات", "Divisions") },
        { _type: "stat", value: "Baghdad", label: l("المقر", "Headquarters") },
      ],
      "intro-fact",
    ),
    statistics: keyed(
      [
        { _type: "stat", value: "2", label: l("علامات مطاعم", "Restaurant brands") },
        { _type: "stat", value: "45", label: l("فرعاً في العراق", "Branches across Iraq") },
        { _type: "stat", value: "3", label: l("قطاعات أعمال", "Business divisions") },
        { _type: "stat", value: "1200", label: l("من أفراد الفريق", "Team members") },
      ],
      "stat",
    ),
    divisionsHeading: l("ثلاثة قطاعات، منصّةٌ واحدة.", "Three divisions, one platform."),
    brandsHeading: l("علاماتٌ يعود إليها الناس.", "Brands people come back for."),
    branchesHeading: l("اعثر على فرعٍ في بغداد", "Find a branch in Baghdad"),
    branchesDescription: l(
      "اضغط على أي علامة لعرض الفرع مع إحداثياته والاتجاهات إليه. محافظاتٌ أخرى قريباً.",
      "Tap any pin to see the branch with its coordinates and directions. More governorates coming soon.",
    ),
    newsHeading: l("أحدث الأخبار", "Latest news"),
    brandFocusHeading: l("نظرةٌ أقرب على علاماتنا.", "A closer look at our brands."),
    sustainability: {
      _type: "contentBlock",
      heading: l("مسؤوليةٌ من المزرعة إلى المائدة.", "Responsible from farm to table."),
      body: l(
        "مطابخ عالية الكفاءة وتوريدٌ مسؤول وتقليل الهدر — العلامات الباقية تُبنى على ممارساتٍ باقية.",
        "Efficient kitchens, responsible sourcing and reduced waste — lasting brands are built on lasting practices.",
      ),
    },
    sustainabilityFacts: keyed(
      [
        { _type: "stat", value: "30%", label: l("هدر أقل", "Less waste") },
        { _type: "stat", value: "100%", label: l("حلال معتمد", "Halal certified") },
        { _type: "stat", value: "12", label: l("مورّداً محلياً", "Local suppliers") },
      ],
      "sustainability",
    ),
  },
  aboutPage: {
    title: l("من نحن", "About us"),
    hero: {
      _type: "pageHero",
      eyebrow: l("من نحن", "About us"),
      title: l(
        "شركةٌ بُنيت لتُنمّي علاماتٍ غذائية عظيمة، بمسؤولية.",
        "A company built to grow great food brands — responsibly.",
      ),
      description: l(
        "من فكرةٍ واحدة عام ٢٠١٤ إلى مجموعةٍ متكاملة تمتدّ عبر المطاعم وإنتاج الأغذية والتجارة — هذه قصّتنا.",
        "From a single idea in 2014 to an integrated group spanning restaurants, food production and trade — this is our story.",
      ),
    },
    introduction: {
      _type: "contentBlock",
      heading: l(
        "نُدير العلامات والمطابخ وسلاسل الإمداد كمنصّةٍ واحدة.",
        "We operate brands, kitchens and supply chains as one platform.",
      ),
      body: l(
        "سبيل الراشد شركةٌ للتجارة العامة وإدارة المطاعم، متخصّصة في إنتاج وتعبئة المواد الغذائية. نمنح العلامات قوّةً تشغيلية للنمو — حوكمةً منضبطة، وإمداداً موثوقاً، وجودةً متّسقة في كل فرع.",
        "Sabeel Al-Rashid is a general trading and restaurant-management company specialised in food production and packaging. We give hospitality brands the operating muscle to scale — disciplined governance, reliable supply, and consistent quality at every branch.",
      ),
    },
    statistics: keyed(
      [
        { _type: "stat", value: "2014", label: l("سنة التأسيس", "Founded") },
        { _type: "stat", value: "45+", label: l("فرعاً", "Branches") },
        { _type: "stat", value: "1200+", label: l("موظفاً", "Employees") },
        { _type: "stat", value: "3", label: l("قطاعات", "Divisions") },
      ],
      "about-stat",
    ),
    historyHeading: l("قصّة الشركة", "Company history"),
    timeline: keyed(
      [
        ["2014", l("تأسيس الشركة", "The company is founded"), l("تأسّست سبيل الراشد للتجارة العامة وإدارة المطاعم.", "Sabeel Al-Rashid is established for general trade and restaurant management.")],
        ["2017", l("إطلاق أول علامة مطاعم", "First restaurant brand launches"), l("افتتح سوبر تشيكن أولى فروعه ليبني قاعدةً من العملاء الأوفياء سريعاً.", "Super Chicken opens its first locations and quickly builds a loyal following.")],
        ["2019", l("تشغيل المطبخ المركزي", "Central kitchen begins operations"), l("منشأة إنتاج مركزية توحّد الجودة وتفتح آفاق التوسّع.", "A central production facility standardises quality and unlocks scale.")],
        ["2021", l("انضمام الركن الشرقي", "Alrukn Alsharqi joins the group"), l("علامةٌ للمطبخ الشرقي الأصيل تُوسّع المحفظة.", "An authentic Eastern-cuisine brand expands the portfolio.")],
        ["2024", l("توسّع قطاع تعبئة الأغذية", "Food packaging division scales up"), l("استثمارٌ في طاقة التعبئة يدعم التجزئة والإمداد للأعمال.", "Investment in packaging capacity supports retail and B2B supply.")],
        ["2026", l("نبني الفصل القادم", "Building the next chapter"), l("منصّةٌ جاهزة للامتياز تفتح أبوابها للمستثمرين والشركاء.", "A franchise-ready platform opens its doors to investors and partners.")],
      ].map(([year, title, description]) => ({
        _type: "timelineItem",
        year,
        title,
        description,
      })),
      "timeline",
    ),
    vision: {
      _type: "contentBlock",
      heading: l("رؤيتنا", "Our Vision"),
      body: l(
        "أن نكون البيت الأكثر ثقةً للعلامات الغذائية في المنطقة — محلّ تقديرٍ للجودة والحوكمة وأسلوب النمو.",
        "To be the region's most trusted house of food brands — admired for quality, governance and the way we grow.",
      ),
    },
    mission: {
      _type: "contentBlock",
      heading: l("رسالتنا", "Our Mission"),
      body: l(
        "أن نبني العلامات الغذائية ونُشغّلها ونوسّعها عبر إنتاجٍ متكامل وعملياتٍ منضبطة وشراكاتٍ باقية.",
        "To build, operate and scale food brands through integrated production, disciplined operations, and partnerships that last.",
      ),
    },
    teamHeading: l("الفريق خلف المجموعة", "The team behind the group"),
  },
  brandsPage: {
    title: l("علاماتنا", "Our brands"),
    hero: {
      _type: "pageHero",
      eyebrow: l("محفظة العلامات", "Brand portfolio"),
      title: l("محفظةٌ من العلامات التي يحبّها الناس.", "A portfolio of brands people love."),
      description: l(
        "كل علامةٍ تقف بذاتها — بهويّتها ومطابخها وجمهورها — مدعومةً بقوّة سبيل الراشد المشتركة.",
        "Each brand stands on its own — with its own identity, kitchens and following — powered by the shared strength of Sabeel Al-Rashid.",
      ),
    },
  },
  franchisePage: {
    title: l("الامتياز", "Franchise"),
    hero: {
      _type: "pageHero",
      eyebrow: l("فرص الامتياز", "Franchise opportunities"),
      title: l("امتلك علامةً مُثبتة. مدعومةً بمُشغّلٍ حقيقي.", "Own a proven brand. Backed by a real operator."),
      description: l(
        "اشترك مع سبيل الراشد لتأخذ علاماتنا إلى أسواقٍ جديدة — بنموذجٍ تشغيلي مُختبر وسلسلة إمدادٍ ودعمٍ كاملٍ خلفك.",
        "Partner with Sabeel Al-Rashid to bring our brands to new markets — with a tested operating model, supply chain and support behind you.",
      ),
    },
    featuresHeading: l("شراكةٌ مُصمّمة للنجاح.", "A partnership designed for success."),
    features: keyed(
      [
        ["badge", l("علامات مُثبتة", "Proven brands"), l("ادخل إلى علاماتٍ ذات طلبٍ حقيقي وعملاء أوفياء وأسماء معروفة.", "Step into brands with real demand, loyal customers and recognised names.")],
        ["supply", l("إمداد متكامل", "Integrated supply"), l("مطابخنا المركزية وقطاع التجارة يُبقيان فرعك مزوّداً باستمرار.", "Our central kitchens and trade division keep your branch reliably stocked.")],
        ["support", l("دعم تشغيلي كامل", "Full operational support"), l("تدريبٌ وإرشاد التجهيز والتسويق ودعمٌ تشغيلي مستمر.", "Training, fit-out guidance, marketing and ongoing operational support.")],
        ["economics", l("اقتصاديات منضبطة", "Disciplined economics"), l("اقتصادياتٌ شفّافة للوحدة وتقاريرٌ بمعايير المستثمرين من اليوم الأول.", "Transparent unit economics and investor-grade reporting from day one.")],
        ["quality", l("أنظمة جودة", "Quality systems"), l("وصفاتٌ موحّدة وأنظمة سلامةٍ غذائية تحمي العلامة في كل مكان.", "Standardised recipes and food-safety systems protect the brand everywhere.")],
        ["growth", l("خارطة نمو", "Growth roadmap"), l("فرصٌ لوحداتٍ متعدّدة ومناطق حصرية للشركاء الملتزمين.", "Multi-unit and territory opportunities for committed partners.")],
      ].map(([icon, title, description]) => ({
        _type: "featureItem",
        icon,
        title,
        description,
      })),
      "franchise-feature",
    ),
    formHeading: l("طلب امتياز", "Franchise application"),
    formDescription: l(
      "حدّثنا عن نفسك وسنتواصل معك خلال خمسة أيام عمل.",
      "Tell us about yourself and we'll be in touch within five business days.",
    ),
  },
  careersPage: {
    title: l("الوظائف", "Careers"),
    hero: {
      _type: "pageHero",
      eyebrow: l("انضم إلى فريقنا", "Join our team"),
      title: l("طوّر مسيرتك حيث تُبنى العلامات العظيمة.", "Grow your career where great brands are built."),
      description: l(
        "من المطبخ إلى المكتب الرئيسي، فريقنا هو سبب عودة الضيوف. اعثر على مكانك في سبيل الراشد.",
        "From the kitchen to the head office, our people are the reason guests come back. Find your place at Sabeel Al-Rashid.",
      ),
    },
    culture: {
      _type: "contentBlock",
      heading: l("جادّون في الطعام. جادّون في الناس.", "Serious about food. Serious about people."),
      body: l(
        "نتحرّك بسرعة، ونلتزم بمعايير عالية، ونمنح فريقنا مسؤوليةً حقيقية مبكراً. نستثمر في التدريب، ونرقّي من الداخل، ونحتفي بحرفة الضيافة.",
        "We move fast, hold ourselves to high standards, and give people real ownership early. We invest in training, promote from within, and celebrate the craft of hospitality.",
      ),
    },
    cultureValues: keyed(
      [
        l("مساراتٌ واضحة للنمو والقيادة", "Clear paths to grow and lead"),
        l("أكاديمية تدريب لكل دور", "Training academy for every role"),
        l("ثقافة احترامٍ وجودة", "A culture of respect and quality"),
      ],
      "culture-value",
    ),
    benefitsHeading: l("المزايا والامتيازات", "Benefits & perks"),
    benefits: keyed(
      [
        ["pay", l("رواتب تنافسية", "Competitive pay"), l("تعويضٌ عادل وشفّاف مع مكافآت الأداء.", "Fair, transparent compensation with performance rewards.")],
        ["health", l("تأمين صحي", "Health coverage"), l("تأمينٌ طبي لك ولأفراد عائلتك المؤهّلين.", "Medical insurance for you and eligible family members.")],
        ["learning", l("تعلّم ونمو", "Learning & growth"), l("تدريبٌ منظّم ومساراتٌ واضحة للترقية.", "Structured training and clear promotion pathways.")],
        ["meals", l("وجبات وخصومات", "Meals & discounts"), l("وجبات الفريق وخصومات على علاماتنا.", "Staff meals and discounts across our brands.")],
        ["growth", l("الترقية من الداخل", "Promote from within"), l("معظم مدرائنا بدؤوا من الخطوط الأمامية.", "Most of our managers started on the front line.")],
        ["clock", l("استقرار", "Stability"), l("مجموعةٌ نامية ومحوكمة جيداً تبني معها مستقبلك.", "A growing, well-governed group you can build a future with.")],
      ].map(([icon, title, description]) => ({
        _type: "featureItem",
        icon,
        title,
        description,
      })),
      "career-benefit",
    ),
    positionsHeading: l("الوظائف الشاغرة", "Open positions"),
    callToAction: {
      _type: "contentBlock",
      heading: l("جاهزٌ للانضمام إلينا؟", "Ready to join us?"),
      body: l(
        "التقديم يستغرق دقائق قليلة — حدّثنا عن نفسك وأرفق سيرتك الذاتية. نراجع كل طلب.",
        "The application takes a few minutes — tell us about yourself and attach your CV. We review every application.",
      ),
    },
    callToActionLabel: l("قدّم الآن", "Apply now"),
  },
  contactPage: {
    title: l("تواصل معنا", "Contact"),
    hero: {
      _type: "pageHero",
      eyebrow: l("تواصل", "Contact"),
      title: l("لنتحدّث.", "Let's talk."),
      description: l(
        "سواءٌ كنت مستثمراً أو مورّداً أو إعلامياً أو ضيفاً لديه ملاحظة — يسعدنا أن نسمع منك.",
        "Whether you're an investor, a supplier, media or a guest with feedback — we'd love to hear from you.",
      ),
    },
    formHeading: l("أرسل لنا رسالة", "Send us a message"),
    formDescription: l("نردّ عادةً خلال يومَي عمل.", "We typically reply within two business days."),
  },
  applicationPage: {
    title: l("طلب توظيف", "Job application"),
    hero: {
      _type: "pageHero",
      eyebrow: l("قدّم الآن", "Apply"),
      title: l("طلب توظيف", "Job application"),
      description: l(
        "املأ بياناتك أدناه — الحقول المعلّمة بـ * إلزامية. نراجع كل طلب.",
        "Fill in your details below — fields marked * are required. We review every application.",
      ),
    },
  },
  newsPage: {
    title: l("الأخبار والإعلام", "News & Media"),
    hero: {
      _type: "pageHero",
      eyebrow: l("غرفة الأخبار", "Newsroom"),
      title: l("الأخبار والإعلام", "News & Media"),
      description: l(
        "آخر ما لدى مجموعة سبيل الراشد.",
        "The latest from across the Sabeel Al-Rashid group.",
      ),
    },
  },
} as const;

async function connectCms() {
  const transaction = client.transaction();
  for (const [id, fields] of Object.entries(pages)) {
    const page = fields as typeof fields & {
      title: ReturnType<typeof l>;
      hero?: { description?: ReturnType<typeof l> };
      introduction?: { body?: ReturnType<typeof l> };
    };
    const defaults = {
      ...fields,
      seo: {
        _type: "seo",
        title: page.title,
        description: page.hero?.description || page.introduction?.body,
        noIndex: false,
      },
    };
    transaction
      .createIfNotExists({ _id: id, _type: id })
      .patch(id, (patch) => patch.setIfMissing(defaults));
  }
  transaction.patch("siteSettings", (patch) =>
    patch.setIfMissing({
      secondaryPhone: "+964 781 000 0000",
      workingHours: l(
        "الأحد – الخميس · ٩:٠٠ – ١٨:٠٠",
        "Sunday – Thursday · 9:00 – 18:00",
      ),
    }),
  );
  await transaction.commit();
  console.log("CMS fields connected without overwriting existing editor content.");
}

connectCms().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
