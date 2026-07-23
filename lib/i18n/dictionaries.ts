import type { Locale } from "./config";

// The English dictionary is the source of truth; its shape defines the type.
// Other locales are checked against it. `t()` falls back to English for any
// missing key so the UI never shows a raw key.

const en = {
  nav: {
    home: "Home",
    about: "About",
    products: "Products",
    news: "News",
    support: "Support",
    contact: "Contact",
  },
  cta: {
    getQuote: "Get a Quote",
    requestQuote: "Request a Quote",
    viewProducts: "View All Products",
    exploreProducts: "Explore Products",
    learnMore: "Learn More",
    readMore: "Read More",
    downloadBrochure: "Download Brochure",
    sendInquiry: "Send Inquiry",
    viewDetails: "View Details",
    contactUs: "Contact Us",
  },
  hero: {
    badge: "Trusted Pump Manufacturer Since 2014",
    // Superlatives ("toughest", "most demanding") come back as 最… once the page
    // is machine-translated into Chinese, which China's Advertising Law bans, so
    // the headline stays comparative-free in every language.
    title: "Sewage Pumps Engineered for Demanding Industries",
    subtitle:
      "Shanghai Haquan Pump Valve Manufacturing Co., Ltd. is a professional sewage pump manufacturer, engineering high-performance pumps for wastewater discharge, food & beverage, farmland irrigation, biopharmaceutical, municipal septic-tank treatment and petrochemical industries — delivered to 60+ countries.",
  },
  stats: {
    experience: "Years of Expertise",
    countries: "Countries Served",
    models: "Pump Models",
    delivered: "Units Delivered",
  },
  sections: {
    advantagesTitle: "Why Global Buyers Choose Haquan",
    advantagesSubtitle:
      "A decade of engineering discipline, in-house manufacturing and export experience behind every pump we ship.",
    productsTitle: "Our Pump Series",
    productsSubtitle:
      "We manufacture and supply WILDEN AODD diaphragm pumps, stainless-steel sewage pumps, ZW self-priming pumps, YW submersible sewage pumps, the QBY diaphragm series, irrigation & drainage mobile pump trucks, GNWQ cutter sewage pumps, IHG/IHW/IRG/IRW pipeline pumps, metering pumps, high-head sewage pumps, QDX submersible pumps and QD oil-filled submersible pumps.",
    testimonialsTitle: "Trusted by Industry Leaders",
    newsTitle: "News & Engineering Insights",
    ctaTitle: "Ready to Solve Your Fluid Challenge?",
    ctaSubtitle:
      "Send us your duty point and application — our engineers will recommend the right pump and return a quotation within 24 hours.",
  },
  footer: {
    tagline:
      "A professional sewage pump manufacturer since 2014 — reliable wastewater and fluid-handling solutions for industry worldwide.",
    quickLinks: "Quick Links",
    ourProducts: "Our Products",
    contactUs: "Contact Us",
    followUs: "Follow Us",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    sitemap: "Sitemap",
  },
  form: {
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    company: "Company",
    message: "Your Message / Requirements",
    send: "Send Inquiry",
    sending: "Sending…",
    success:
      "Thank you! Your inquiry has been received. Our team will respond within 24 hours.",
    error: "Something went wrong. Please try again or email us directly.",
  },
  specs: {
    flow: "Flow Rate",
    head: "Head",
    power: "Power",
    diameter: "Inlet / Outlet",
    material: "Material",
    specifications: "Specifications",
  },
  common: {
    allSeries: "All Series",
    relatedProducts: "Related Products",
    backToProducts: "Back to Products",
    backToNews: "Back to News",
    industries: "Applications & Industries",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
  },
};

export type Dictionary = typeof en;
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

// --- Chinese -------------------------------------------------------------
const zh: DeepPartial<Dictionary> = {
  nav: { home: "首页", about: "关于我们", products: "产品中心", news: "新闻", support: "技术支持", contact: "联系我们" },
  cta: {
    getQuote: "获取报价", requestQuote: "索取报价", viewProducts: "查看全部产品", exploreProducts: "浏览产品",
    learnMore: "了解更多", readMore: "阅读全文", downloadBrochure: "下载样本", sendInquiry: "发送询盘",
    viewDetails: "查看详情", contactUs: "联系我们",
  },
  hero: {
    badge: "自 2014 年起值得信赖的水泵制造商",
    title: "为全球严苛工况打造专业排污泵",
    subtitle:
      "上海哈泉泵阀制造有限公司是专业的排污泵生产制造厂家，为排污水、食品饮料、农田灌溉、生物制药、市政化粪池处理及石油化工等基础行业提供高性能水泵，产品远销 60 多个国家和地区。",
  },
  stats: { experience: "年专业经验", countries: "服务国家", models: "泵型号", delivered: "交付台数" },
  sections: {
    advantagesTitle: "全球客户为何选择哈泉",
    advantagesSubtitle: "十年如一的工程标准、自有制造能力与丰富的出口经验，铸就每一台水泵。",
    productsTitle: "产品系列",
    productsSubtitle:
      "专业生产销售威尔顿隔膜泵、不锈钢排污泵、ZW 自吸泵、YW 液下式排污泵、QBY 隔膜泵系列、农田灌溉/排水移动泵车、GNWQ 带切割刀排污泵、IHG/IHW/IRG/IRW 系列管道排污泵、计量泵、高扬程排污泵、QDX 系列潜水电泵、QD 系列油浸式潜水电泵。",
    testimonialsTitle: "深受行业领军企业信赖",
    newsTitle: "新闻与工程洞察",
    ctaTitle: "准备好解决您的流体难题了吗？",
    ctaSubtitle: "请告知您的工况参数与应用场景，我们的工程师将推荐合适的泵型并在 24 小时内回复报价。",
  },
  footer: {
    tagline: "自 2014 年起专业排污泵生产制造厂家，为全球工业提供可靠的排污与流体输送解决方案。",
    quickLinks: "快速链接", ourProducts: "产品系列", contactUs: "联系我们", followUs: "关注我们",
    rights: "版权所有。", privacy: "隐私政策", terms: "使用条款", sitemap: "网站地图",
  },
  form: {
    name: "姓名", email: "电子邮箱", phone: "电话", company: "公司名称", message: "您的留言 / 需求",
    send: "发送询盘", sending: "发送中…",
    success: "感谢您的咨询！我们已收到您的询盘，团队将在 24 小时内回复。",
    error: "提交失败，请重试或直接发送邮件联系我们。",
  },
  specs: {
    flow: "流量", head: "扬程", power: "功率", diameter: "进/出口", material: "材质",
    specifications: "技术参数",
  },
  common: {
    allSeries: "全部系列", relatedProducts: "相关产品", backToProducts: "返回产品", backToNews: "返回新闻",
    industries: "应用领域", page: "第", of: "页 / 共", previous: "上一页", next: "下一页",
  },
};

// --- Spanish -------------------------------------------------------------
const es: DeepPartial<Dictionary> = {
  nav: { home: "Inicio", about: "Nosotros", products: "Productos", news: "Noticias", support: "Soporte", contact: "Contacto" },
  cta: {
    getQuote: "Solicitar Cotización", requestQuote: "Pedir Cotización", viewProducts: "Ver Todos los Productos",
    exploreProducts: "Explorar Productos", learnMore: "Saber Más", readMore: "Leer Más",
    downloadBrochure: "Descargar Folleto", sendInquiry: "Enviar Consulta", viewDetails: "Ver Detalles", contactUs: "Contáctenos",
  },
  hero: {
    badge: "Fabricante de Bombas de Confianza Desde 2014",
    title: "Bombas de Aguas Residuales para Industrias Exigentes",
    subtitle:
      "Shanghai Haquan Pump Valve Manufacturing Co., Ltd. es un fabricante profesional de bombas de aguas residuales, con bombas de alto rendimiento para el tratamiento de aguas residuales, alimentación y bebidas, riego agrícola, biofarmacia, tratamiento de fosas sépticas municipales y petroquímica — entregadas en más de 60 países.",
  },
  stats: { experience: "Años de Experiencia", countries: "Países Atendidos", models: "Modelos de Bombas", delivered: "Unidades Entregadas" },
  sections: {
    advantagesTitle: "Por Qué los Compradores Globales Eligen Haquan",
    advantagesSubtitle: "Una década de disciplina de ingeniería, fabricación propia y experiencia exportadora detrás de cada bomba.",
    productsTitle: "Nuestras Series de Bombas",
    productsSubtitle:
      "Fabricamos y suministramos bombas de diafragma WILDEN AODD, bombas de aguas residuales de acero inoxidable, bombas autocebantes ZW, bombas sumergibles de aguas residuales YW, la serie de diafragma QBY, carros-bomba móviles de riego y drenaje, bombas trituradoras GNWQ, bombas de tubería IHG/IHW/IRG/IRW, bombas dosificadoras, bombas de aguas residuales de gran altura, bombas sumergibles QDX y bombas sumergibles en baño de aceite QD.",
    testimonialsTitle: "La Confianza de Líderes de la Industria",
    newsTitle: "Noticias e Información Técnica",
    ctaTitle: "¿Listo para Resolver su Desafío de Fluidos?",
    ctaSubtitle: "Envíenos su punto de trabajo y aplicación — nuestros ingenieros recomendarán la bomba adecuada y responderán con una cotización en 24 horas.",
  },
  footer: {
    tagline: "Fabricante profesional de bombas de aguas residuales desde 2014: soluciones fiables de aguas residuales y manejo de fluidos para la industria mundial.",
    quickLinks: "Enlaces Rápidos", ourProducts: "Nuestros Productos", contactUs: "Contáctenos", followUs: "Síganos",
    rights: "Todos los derechos reservados.", privacy: "Política de Privacidad", terms: "Términos de Uso", sitemap: "Mapa del Sitio",
  },
  form: {
    name: "Nombre Completo", email: "Correo Electrónico", phone: "Teléfono", company: "Empresa", message: "Su Mensaje / Requisitos",
    send: "Enviar Consulta", sending: "Enviando…",
    success: "¡Gracias! Hemos recibido su consulta. Nuestro equipo responderá en 24 horas.",
    error: "Algo salió mal. Inténtelo de nuevo o envíenos un correo directamente.",
  },
  specs: {
    flow: "Caudal", head: "Altura", power: "Potencia", diameter: "Entrada / Salida", material: "Material",
    specifications: "Especificaciones",
  },
  common: {
    allSeries: "Todas las Series", relatedProducts: "Productos Relacionados", backToProducts: "Volver a Productos",
    backToNews: "Volver a Noticias", industries: "Aplicaciones e Industrias", page: "Página", of: "de", previous: "Anterior", next: "Siguiente",
  },
};

// --- German --------------------------------------------------------------
const de: DeepPartial<Dictionary> = {
  nav: { home: "Startseite", about: "Über uns", products: "Produkte", news: "Aktuelles", support: "Support", contact: "Kontakt" },
  cta: {
    getQuote: "Angebot Anfordern", requestQuote: "Angebot Anfordern", viewProducts: "Alle Produkte Ansehen",
    exploreProducts: "Produkte Entdecken", learnMore: "Mehr Erfahren", readMore: "Weiterlesen",
    downloadBrochure: "Broschüre Herunterladen", sendInquiry: "Anfrage Senden", viewDetails: "Details Ansehen", contactUs: "Kontakt",
  },
  hero: {
    badge: "Zuverlässiger Pumpenhersteller Seit 2014",
    title: "Abwasserpumpen für anspruchsvolle Industrien",
    subtitle:
      "Shanghai Haquan Pump Valve Manufacturing Co., Ltd. ist ein professioneller Hersteller von Abwasserpumpen und fertigt Hochleistungspumpen für Abwasserförderung, Lebensmittel- und Getränkeindustrie, Feldbewässerung, Biopharmazie, kommunale Klärgrubenbehandlung und Petrochemie — geliefert in über 60 Länder.",
  },
  stats: { experience: "Jahre Erfahrung", countries: "Belieferte Länder", models: "Pumpenmodelle", delivered: "Gelieferte Einheiten" },
  sections: {
    advantagesTitle: "Warum Globale Einkäufer Haquan Wählen",
    advantagesSubtitle: "Ein Jahrzehnt technischer Disziplin, eigene Fertigung und Exporterfahrung in jeder Pumpe.",
    productsTitle: "Unsere Pumpenserien",
    productsSubtitle:
      "Wir fertigen und liefern WILDEN AODD Membranpumpen, Abwasserpumpen aus Edelstahl, ZW Selbstansaugpumpen, YW Tauch-Abwasserpumpen, die QBY Membranpumpen-Serie, mobile Bewässerungs- und Entwässerungs-Pumpwagen, GNWQ Schneidrad-Abwasserpumpen, IHG/IHW/IRG/IRW Rohrpumpen, Dosierpumpen, Hochdruck-Abwasserpumpen, QDX Tauchpumpen und QD ölgefüllte Tauchpumpen.",
    testimonialsTitle: "Vertrauen der Branchenführer",
    newsTitle: "Aktuelles & Technische Einblicke",
    ctaTitle: "Bereit, Ihre Fluid-Herausforderung zu Lösen?",
    ctaSubtitle: "Senden Sie uns Ihren Betriebspunkt und Ihre Anwendung — unsere Ingenieure empfehlen die richtige Pumpe und antworten innerhalb von 24 Stunden mit einem Angebot.",
  },
  footer: {
    tagline: "Professioneller Hersteller von Abwasserpumpen seit 2014 – zuverlässige Lösungen für Abwasser- und Fluidförderung für die Industrie weltweit.",
    quickLinks: "Schnelllinks", ourProducts: "Unsere Produkte", contactUs: "Kontakt", followUs: "Folgen Sie Uns",
    rights: "Alle Rechte vorbehalten.", privacy: "Datenschutzerklärung", terms: "Nutzungsbedingungen", sitemap: "Sitemap",
  },
  form: {
    name: "Vollständiger Name", email: "E-Mail-Adresse", phone: "Telefonnummer", company: "Unternehmen", message: "Ihre Nachricht / Anforderungen",
    send: "Anfrage Senden", sending: "Wird gesendet…",
    success: "Vielen Dank! Ihre Anfrage ist eingegangen. Unser Team antwortet innerhalb von 24 Stunden.",
    error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.",
  },
  specs: {
    flow: "Förderstrom", head: "Förderhöhe", power: "Leistung", diameter: "Eintritt / Austritt", material: "Werkstoff",
    specifications: "Technische Daten",
  },
  common: {
    allSeries: "Alle Serien", relatedProducts: "Ähnliche Produkte", backToProducts: "Zurück zu Produkten",
    backToNews: "Zurück zu Aktuelles", industries: "Anwendungen & Industrien", page: "Seite", of: "von", previous: "Zurück", next: "Weiter",
  },
};

// --- Russian -------------------------------------------------------------
const ru: DeepPartial<Dictionary> = {
  nav: { home: "Главная", about: "О компании", products: "Продукция", news: "Новости", support: "Поддержка", contact: "Контакты" },
  cta: {
    getQuote: "Запросить Цену", requestQuote: "Запросить Цену", viewProducts: "Вся Продукция",
    exploreProducts: "Смотреть Продукцию", learnMore: "Подробнее", readMore: "Читать Далее",
    downloadBrochure: "Скачать Каталог", sendInquiry: "Отправить Запрос", viewDetails: "Подробнее", contactUs: "Связаться",
  },
  hero: {
    badge: "Надёжный Производитель Насосов с 2014 Года",
    title: "Канализационные насосы для сложных отраслей",
    subtitle:
      "Shanghai Haquan Pump Valve Manufacturing Co., Ltd. — профессиональный производитель канализационных насосов, выпускающий высокопроизводительные насосы для отвода сточных вод, пищевой промышленности, орошения полей, биофармацевтики, обработки муниципальных септиков и нефтехимии — с поставками более чем в 60 стран.",
  },
  stats: { experience: "Лет Опыта", countries: "Стран Поставок", models: "Моделей Насосов", delivered: "Поставлено Единиц" },
  sections: {
    advantagesTitle: "Почему Покупатели по Всему Миру Выбирают Haquan",
    advantagesSubtitle: "Десятилетие инженерной дисциплины, собственное производство и опыт экспорта в каждом насосе.",
    productsTitle: "Наши Серии Насосов",
    productsSubtitle:
      "Мы производим и поставляем мембранные насосы WILDEN AODD, канализационные насосы из нержавеющей стали, самовсасывающие насосы ZW, погружные канализационные насосы YW, серию мембранных насосов QBY, мобильные насосные установки для орошения и дренажа, канализационные насосы с режущим механизмом GNWQ, трубопроводные насосы IHG/IHW/IRG/IRW, дозирующие насосы, канализационные насосы с большим напором, погружные насосы QDX и маслозаполненные погружные насосы QD.",
    testimonialsTitle: "Нам Доверяют Лидеры Отрасли",
    newsTitle: "Новости и Технические Материалы",
    ctaTitle: "Готовы Решить Вашу Задачу по Перекачке?",
    ctaSubtitle: "Сообщите нам рабочую точку и применение — наши инженеры подберут нужный насос и пришлют коммерческое предложение в течение 24 часов.",
  },
  footer: {
    tagline: "Профессиональный производитель канализационных насосов с 2014 года — надёжные решения для отвода сточных вод и перекачки жидкостей для мировой промышленности.",
    quickLinks: "Быстрые Ссылки", ourProducts: "Наша Продукция", contactUs: "Контакты", followUs: "Мы в Соцсетях",
    rights: "Все права защищены.", privacy: "Политика Конфиденциальности", terms: "Условия Использования", sitemap: "Карта Сайта",
  },
  form: {
    name: "Имя", email: "Электронная Почта", phone: "Телефон", company: "Компания", message: "Ваше Сообщение / Требования",
    send: "Отправить Запрос", sending: "Отправка…",
    success: "Спасибо! Ваш запрос получен. Наша команда ответит в течение 24 часов.",
    error: "Произошла ошибка. Попробуйте ещё раз или напишите нам напрямую.",
  },
  specs: {
    flow: "Подача", head: "Напор", power: "Мощность", diameter: "Вход / Выход", material: "Материал",
    specifications: "Технические Характеристики",
  },
  common: {
    allSeries: "Все Серии", relatedProducts: "Похожие Товары", backToProducts: "Назад к Продукции",
    backToNews: "Назад к Новостям", industries: "Применение и Отрасли", page: "Страница", of: "из", previous: "Назад", next: "Вперёд",
  },
};

// --- Arabic (RTL) --------------------------------------------------------
const ar: DeepPartial<Dictionary> = {
  nav: { home: "الرئيسية", about: "من نحن", products: "المنتجات", news: "الأخبار", support: "الدعم", contact: "اتصل بنا" },
  cta: {
    getQuote: "اطلب عرض سعر", requestQuote: "اطلب عرض سعر", viewProducts: "عرض كل المنتجات",
    exploreProducts: "استكشف المنتجات", learnMore: "اعرف المزيد", readMore: "اقرأ المزيد",
    downloadBrochure: "تحميل الكتيب", sendInquiry: "إرسال استفسار", viewDetails: "عرض التفاصيل", contactUs: "اتصل بنا",
  },
  hero: {
    badge: "مُصنّع مضخات موثوق منذ عام 2014",
    title: "مضخات الصرف الصحي للصناعات الشاقة",
    subtitle:
      "شركة شنغهاي هاكوان لتصنيع المضخات والصمامات المحدودة مُصنّع محترف لمضخات الصرف الصحي، تصمم مضخات عالية الأداء لتصريف مياه الصرف والأغذية والمشروبات والري الزراعي والصناعات الحيوية الدوائية ومعالجة خزانات الصرف البلدية والبتروكيماويات — وتُصدّر إلى أكثر من 60 دولة.",
  },
  stats: { experience: "سنوات الخبرة", countries: "الدول المخدومة", models: "موديلات المضخات", delivered: "وحدة تم تسليمها" },
  sections: {
    advantagesTitle: "لماذا يختار المشترون حول العالم هاكوان",
    advantagesSubtitle: "عقد من الانضباط الهندسي والتصنيع الذاتي وخبرة التصدير وراء كل مضخة.",
    productsTitle: "سلاسل المضخات لدينا",
    productsSubtitle:
      "نصنّع ونورّد مضخات الحجاب الحاجز WILDEN AODD، ومضخات الصرف من الفولاذ المقاوم للصدأ، ومضخات ZW ذاتية التحضير، ومضخات الصرف الغاطسة YW، وسلسلة الحجاب الحاجز QBY، وعربات الضخ المتنقلة للري والصرف، ومضخات الصرف بسكين القطع GNWQ، ومضخات الأنابيب IHG/IHW/IRG/IRW، ومضخات القياس والجرعات، ومضخات الصرف عالية الرفع، ومضخات QDX الغاطسة، ومضخات QD الغاطسة المغمورة بالزيت.",
    testimonialsTitle: "ثقة كبار قادة الصناعة",
    newsTitle: "الأخبار والرؤى الهندسية",
    ctaTitle: "هل أنت مستعد لحل تحدي السوائل لديك؟",
    ctaSubtitle: "أرسل لنا نقطة التشغيل والتطبيق — سيوصي مهندسونا بالمضخة المناسبة ويردّون بعرض سعر خلال 24 ساعة.",
  },
  footer: {
    tagline: "مُصنّع محترف لمضخات الصرف الصحي منذ عام 2014 — حلول موثوقة لمعالجة مياه الصرف ومناولة السوائل للصناعة حول العالم.",
    quickLinks: "روابط سريعة", ourProducts: "منتجاتنا", contactUs: "اتصل بنا", followUs: "تابعنا",
    rights: "جميع الحقوق محفوظة.", privacy: "سياسة الخصوصية", terms: "شروط الاستخدام", sitemap: "خريطة الموقع",
  },
  form: {
    name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف", company: "الشركة", message: "رسالتك / متطلباتك",
    send: "إرسال استفسار", sending: "جارٍ الإرسال…",
    success: "شكرًا لك! تم استلام استفسارك. سيرد فريقنا خلال 24 ساعة.",
    error: "حدث خطأ ما. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة.",
  },
  specs: {
    flow: "معدل التدفق", head: "الرفع", power: "القدرة", diameter: "المدخل / المخرج", material: "المادة",
    specifications: "المواصفات",
  },
  common: {
    allSeries: "كل السلاسل", relatedProducts: "منتجات ذات صلة", backToProducts: "العودة إلى المنتجات",
    backToNews: "العودة إلى الأخبار", industries: "التطبيقات والصناعات", page: "صفحة", of: "من", previous: "السابق", next: "التالي",
  },
};

// --- French ---------------------------------------------------------------
const fr: DeepPartial<Dictionary> = {
  nav: { home: "Accueil", about: "À propos", products: "Produits", news: "Actualités", support: "Support", contact: "Contact" },
  cta: { viewDetails: "Voir les détails", getQuote: "Demander un devis", exploreProducts: "Voir les produits", contactUs: "Nous contacter", readMore: "Lire la suite" },
  specs: { flow: "Débit", head: "Hauteur", power: "Puissance", diameter: "Entrée / Sortie", material: "Matériau", specifications: "Spécifications" },
  common: { allSeries: "Toutes les séries", relatedProducts: "Produits associés", backToProducts: "Retour aux produits", industries: "Applications et secteurs", previous: "Précédent", next: "Suivant" },
};

// --- Portuguese -----------------------------------------------------------
const pt: DeepPartial<Dictionary> = {
  nav: { home: "Início", about: "Sobre", products: "Produtos", news: "Notícias", support: "Suporte", contact: "Contato" },
  cta: { viewDetails: "Ver detalhes", getQuote: "Solicitar orçamento", exploreProducts: "Ver produtos", contactUs: "Fale conosco", readMore: "Leia mais" },
  specs: { flow: "Vazão", head: "Altura", power: "Potência", diameter: "Entrada / Saída", material: "Material", specifications: "Especificações" },
  common: { allSeries: "Todas as séries", relatedProducts: "Produtos relacionados", backToProducts: "Voltar aos produtos", industries: "Aplicações e setores", previous: "Anterior", next: "Próximo" },
};

export const dictionaries: Record<Locale, DeepPartial<Dictionary>> = {
  en,
  zh,
  es,
  de,
  ru,
  ar,
  fr,
  pt,
};

export { en as enDictionary };
