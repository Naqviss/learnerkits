import type { Locale } from "@/lib/i18n/config";
import type { SubjectSlug } from "./catalog";

type SubjectImage = { src: string; smallSrc: string; width: number; height: number; alt: Record<Locale, string> };
const asset = (slug: string, alt: Record<Locale, string>): SubjectImage => ({
  src: `/images/subjects/learnerkits-${slug}.webp`,
  smallSrc: `/images/subjects/learnerkits-${slug}-640.webp`,
  width: 1200,
  height: 800,
  alt,
});

export const subjectImages: Partial<Record<SubjectSlug, SubjectImage>> = {
  space: asset("space", {
    en: "Illustration of Earth and a satellite above a rocky lunar landscape.",
    es: "Ilustración de la Tierra y un satélite sobre un paisaje lunar rocoso.",
    zh: "地球和卫星悬于岩石遍布的月球地貌上方的插画。",
    ar: "رسم توضيحي للأرض وقمر صناعي فوق تضاريس قمرية صخرية.",
    pt: "Ilustração da Terra e de um satélite sobre uma paisagem lunar rochosa.",
    fr: "Illustration de la Terre et d’un satellite au-dessus d’un paysage lunaire rocheux.",
    ru: "Иллюстрация Земли и спутника над каменистым лунным ландшафтом.",
    ja: "岩の多い月面の上に地球と人工衛星を描いたイラスト。",
    de: "Illustration der Erde und eines Satelliten über einer felsigen Mondlandschaft.",
  }),
  physics: asset("physics", {
    en: "Illustration of a prism separating white light into a spectrum, with a pendulum and copper coil on a physics bench.",
    es: "Ilustración de un prisma que separa la luz blanca en un espectro, con un péndulo y una bobina de cobre en una mesa de física.",
    zh: "物理实验台上的三棱镜将白光分解为光谱，后方有摆锤和铜线圈的插画。",
    ar: "رسم توضيحي لمنشور يحلل الضوء الأبيض إلى طيف، مع بندول وملف نحاسي على طاولة تجارب فيزيائية.",
    pt: "Ilustração de um prisma separando luz branca em um espectro, com um pêndulo e uma bobina de cobre numa bancada de física.",
    fr: "Illustration d’un prisme décomposant la lumière blanche en spectre, avec un pendule et une bobine de cuivre sur une paillasse.",
    ru: "Иллюстрация призмы, разлагающей белый свет в спектр, с маятником и медной катушкой на лабораторном столе.",
    ja: "白色光をスペクトルに分けるプリズムと、実験台の振り子や銅線コイルを描いたイラスト。",
    de: "Illustration eines Prismas, das weißes Licht in ein Spektrum zerlegt, mit Pendel und Kupferspule auf einem Physiklabortisch.",
  }),
  geography: asset("geography", {
    en: "Cutaway landscape illustration showing mountains, a winding river, a coastline, and layers of rock beneath the surface.",
    es: "Ilustración de un paisaje en corte con montañas, un río sinuoso, una costa y capas de roca bajo la superficie.",
    zh: "展示山脉、蜿蜒河流、海岸和地表下岩层的地貌剖面插画。",
    ar: "رسم توضيحي مقطعي لمنظر طبيعي يضم جبالًا ونهرًا متعرجًا وساحلًا وطبقات صخرية تحت السطح.",
    pt: "Ilustração de uma paisagem em corte com montanhas, um rio sinuoso, uma costa e camadas de rocha abaixo da superfície.",
    fr: "Illustration d’un paysage en coupe montrant des montagnes, une rivière sinueuse, un littoral et des couches rocheuses souterraines.",
    ru: "Иллюстрация ландшафта в разрезе: горы, извилистая река, побережье и слои горных пород под поверхностью.",
    ja: "山々、蛇行する川、海岸、地表の下の岩層を示す地形の断面イラスト。",
    de: "Landschaftsillustration im Querschnitt mit Bergen, einem gewundenen Fluss, einer Küste und Gesteinsschichten unter der Oberfläche.",
  }),
  "environmental-science": asset("environmental-science", {
    en: "Illustration of coastal wetlands and a river beside forested hills, a town, wind turbines, and solar panels.",
    es: "Ilustración de humedales costeros y un río junto a colinas boscosas, una localidad, aerogeneradores y paneles solares.",
    zh: "沿海湿地与河流的插画，周围有森林山丘、城镇、风力发电机和太阳能电池板。",
    ar: "رسم توضيحي لأراضٍ رطبة ساحلية ونهر بجوار تلال حرجية وبلدة وتوربينات رياح وألواح شمسية.",
    pt: "Ilustração de zonas úmidas costeiras e um rio junto a colinas arborizadas, uma cidade, turbinas eólicas e painéis solares.",
    fr: "Illustration de zones humides côtières et d’une rivière près de collines boisées, d’une ville, d’éoliennes et de panneaux solaires.",
    ru: "Иллюстрация прибрежных водно-болотных угодий и реки рядом с лесистыми холмами, городом, ветрогенераторами и солнечными панелями.",
    ja: "森林に覆われた丘、町、風力発電機、太陽光パネルに囲まれた沿岸湿地と川のイラスト。",
    de: "Illustration von Küstenfeuchtgebieten und einem Fluss neben bewaldeten Hügeln, einer Stadt, Windrädern und Solarmodulen.",
  }),
  chemistry: asset("chemistry", {
    en: "Illustration of laboratory flasks with blue and amber solutions, a pipette, and a ball-and-stick molecular model.",
    es: "Ilustración de matraces de laboratorio con soluciones azules y ámbar, una pipeta y un modelo molecular de bolas y varillas.",
    zh: "装有蓝色和琥珀色溶液的实验烧瓶、滴管和球棍分子模型的插画。",
    ar: "رسم توضيحي لدوارق مختبرية تحتوي على محاليل زرقاء وكهرمانية، وماصة ونموذج جزيئي بالكرات والعصي.",
    pt: "Ilustração de frascos de laboratório com soluções azuis e âmbar, uma pipeta e um modelo molecular de bolas e varetas.",
    fr: "Illustration de flacons de laboratoire contenant des solutions bleues et ambrées, d’une pipette et d’un modèle moléculaire à boules et bâtonnets.",
    ru: "Иллюстрация лабораторных колб с синим и янтарным растворами, пипетки и шаростержневой модели молекулы.",
    ja: "青色と琥珀色の溶液が入った実験用フラスコ、ピペット、球棒分子模型のイラスト。",
    de: "Illustration von Laborkolben mit blauen und bernsteinfarbenen Lösungen, einer Pipette und einem Kugel-Stab-Molekülmodell.",
  }),
};

export const subjectImageCaptions: Record<Locale, string> = {
  en: "AI-generated subject illustration by LearnerKits. Not to scale.",
  es: "Ilustración temática generada con IA por LearnerKits. No está a escala.",
  zh: "LearnerKits 使用 AI 生成的学科插画，未按比例绘制。",
  ar: "رسم توضيحي للمادة أنشأته LearnerKits بالذكاء الاصطناعي. غير مرسوم بمقياس.",
  pt: "Ilustração temática gerada com IA pela LearnerKits. Fora de escala.",
  fr: "Illustration thématique générée par IA pour LearnerKits. Non à l’échelle.",
  ru: "Тематическая иллюстрация LearnerKits, созданная с помощью ИИ. Масштаб не соблюдён.",
  ja: "LearnerKits が AI で生成した学科イラスト。縮尺は実際と異なります。",
  de: "KI-generierte Fachillustration von LearnerKits. Nicht maßstabsgetreu.",
};

export const subjectImagesUpdatedAt = "2026-09-26";
