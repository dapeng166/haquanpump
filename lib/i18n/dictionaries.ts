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
    title: "Engineered Fluid Solutions for the World's Toughest Industries",
    subtitle:
      "Shanghai Haquan designs and manufactures high-performance industrial pumps for mining, municipal, petrochemical, marine and power applications — delivered to 60+ countries.",
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
      "Six core product families engineered for sewage, slurry, process and clean-water duty.",
    testimonialsTitle: "Trusted by Industry Leaders",
    newsTitle: "News & Engineering Insights",
    ctaTitle: "Ready to Solve Your Fluid Challenge?",
    ctaSubtitle:
      "Send us your duty point and application — our engineers will recommend the right pump and return a quotation within 24 hours.",
  },
  footer: {
    tagline:
      "Industrial pump manufacturing since 2014. Reliable fluid handling solutions for global industry.",
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
    title: "为全球严苛工况提供专业流体解决方案",
    subtitle:
      "上海哈泉专注于高性能工业泵的设计与制造，广泛应用于矿山、市政、石化、船舶及电力领域，产品远销 60 多个国家和地区。",
  },
  stats: { experience: "年专业经验", countries: "服务国家", models: "泵型号", delivered: "交付台数" },
  sections: {
    advantagesTitle: "全球客户为何选择哈泉",
    advantagesSubtitle: "十年如一的工程标准、自有制造能力与丰富的出口经验，铸就每一台水泵。",
    productsTitle: "产品系列",
    productsSubtitle: "六大核心产品系列，覆盖污水、泥浆、工艺流程与清水工况。",
    testimonialsTitle: "深受行业领军企业信赖",
    newsTitle: "新闻与工程洞察",
    ctaTitle: "准备好解决您的流体难题了吗？",
    ctaSubtitle: "请告知您的工况参数与应用场景，我们的工程师将推荐合适的泵型并在 24 小时内回复报价。",
  },
  footer: {
    tagline: "自 2014 年专注工业泵制造，为全球工业提供可靠的流体输送解决方案。",
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
    title: "Soluciones de Fluidos de Ingeniería para las Industrias Más Exigentes",
    subtitle:
      "Shanghai Haquan diseña y fabrica bombas industriales de alto rendimiento para minería, agua municipal, petroquímica, marina y energía — entregadas en más de 60 países.",
  },
  stats: { experience: "Años de Experiencia", countries: "Países Atendidos", models: "Modelos de Bombas", delivered: "Unidades Entregadas" },
  sections: {
    advantagesTitle: "Por Qué los Compradores Globales Eligen Haquan",
    advantagesSubtitle: "Una década de disciplina de ingeniería, fabricación propia y experiencia exportadora detrás de cada bomba.",
    productsTitle: "Nuestras Series de Bombas",
    productsSubtitle: "Seis familias de productos para aguas residuales, lodos, procesos y agua limpia.",
    testimonialsTitle: "La Confianza de Líderes de la Industria",
    newsTitle: "Noticias e Información Técnica",
    ctaTitle: "¿Listo para Resolver su Desafío de Fluidos?",
    ctaSubtitle: "Envíenos su punto de trabajo y aplicación — nuestros ingenieros recomendarán la bomba adecuada y responderán con una cotización en 24 horas.",
  },
  footer: {
    tagline: "Fabricación de bombas industriales desde 2014. Soluciones fiables de manejo de fluidos para la industria global.",
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
    title: "Technische Fluidlösungen für die Anspruchsvollsten Industrien der Welt",
    subtitle:
      "Shanghai Haquan entwickelt und fertigt Hochleistungs-Industriepumpen für Bergbau, kommunale Wasserwirtschaft, Petrochemie, Schifffahrt und Energie — geliefert in über 60 Länder.",
  },
  stats: { experience: "Jahre Erfahrung", countries: "Belieferte Länder", models: "Pumpenmodelle", delivered: "Gelieferte Einheiten" },
  sections: {
    advantagesTitle: "Warum Globale Einkäufer Haquan Wählen",
    advantagesSubtitle: "Ein Jahrzehnt technischer Disziplin, eigene Fertigung und Exporterfahrung in jeder Pumpe.",
    productsTitle: "Unsere Pumpenserien",
    productsSubtitle: "Sechs Kernproduktfamilien für Abwasser, Schlamm, Prozess- und Reinwasseranwendungen.",
    testimonialsTitle: "Vertrauen der Branchenführer",
    newsTitle: "Aktuelles & Technische Einblicke",
    ctaTitle: "Bereit, Ihre Fluid-Herausforderung zu Lösen?",
    ctaSubtitle: "Senden Sie uns Ihren Betriebspunkt und Ihre Anwendung — unsere Ingenieure empfehlen die richtige Pumpe und antworten innerhalb von 24 Stunden mit einem Angebot.",
  },
  footer: {
    tagline: "Industriepumpenfertigung seit 2014. Zuverlässige Lösungen für die Fluidförderung der globalen Industrie.",
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
    title: "Инженерные Решения для Перекачки Жидкостей в Самых Сложных Отраслях",
    subtitle:
      "Shanghai Haquan разрабатывает и производит высокопроизводительные промышленные насосы для горнодобывающей, муниципальной, нефтехимической, судовой и энергетической отраслей — с поставками в более чем 60 стран.",
  },
  stats: { experience: "Лет Опыта", countries: "Стран Поставок", models: "Моделей Насосов", delivered: "Поставлено Единиц" },
  sections: {
    advantagesTitle: "Почему Покупатели по Всему Миру Выбирают Haquan",
    advantagesSubtitle: "Десятилетие инженерной дисциплины, собственное производство и опыт экспорта в каждом насосе.",
    productsTitle: "Наши Серии Насосов",
    productsSubtitle: "Шесть основных продуктовых линеек для сточных вод, шламов, технологических процессов и чистой воды.",
    testimonialsTitle: "Нам Доверяют Лидеры Отрасли",
    newsTitle: "Новости и Технические Материалы",
    ctaTitle: "Готовы Решить Вашу Задачу по Перекачке?",
    ctaSubtitle: "Сообщите нам рабочую точку и применение — наши инженеры подберут нужный насос и пришлют коммерческое предложение в течение 24 часов.",
  },
  footer: {
    tagline: "Производство промышленных насосов с 2014 года. Надёжные решения для перекачки жидкостей в мировой промышленности.",
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
    title: "حلول هندسية لنقل السوائل لأصعب الصناعات في العالم",
    subtitle:
      "تصمم شركة شنغهاي هاكوان وتصنّع مضخات صناعية عالية الأداء لقطاعات التعدين والمياه البلدية والبتروكيماويات والبحرية والطاقة — وتُصدّر إلى أكثر من 60 دولة.",
  },
  stats: { experience: "سنوات الخبرة", countries: "الدول المخدومة", models: "موديلات المضخات", delivered: "وحدة تم تسليمها" },
  sections: {
    advantagesTitle: "لماذا يختار المشترون حول العالم هاكوان",
    advantagesSubtitle: "عقد من الانضباط الهندسي والتصنيع الذاتي وخبرة التصدير وراء كل مضخة.",
    productsTitle: "سلاسل المضخات لدينا",
    productsSubtitle: "ست عائلات منتجات أساسية لمياه الصرف والحمأة والعمليات والمياه النظيفة.",
    testimonialsTitle: "ثقة كبار قادة الصناعة",
    newsTitle: "الأخبار والرؤى الهندسية",
    ctaTitle: "هل أنت مستعد لحل تحدي السوائل لديك؟",
    ctaSubtitle: "أرسل لنا نقطة التشغيل والتطبيق — سيوصي مهندسونا بالمضخة المناسبة ويردّون بعرض سعر خلال 24 ساعة.",
  },
  footer: {
    tagline: "تصنيع المضخات الصناعية منذ عام 2014. حلول موثوقة لمناولة السوائل للصناعة العالمية.",
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

export const dictionaries: Record<Locale, DeepPartial<Dictionary>> = {
  en,
  zh,
  es,
  de,
  ru,
  ar,
};

export { en as enDictionary };
