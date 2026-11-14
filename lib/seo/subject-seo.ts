import type { Locale } from "@/lib/i18n/config";
import type { SubjectSlug } from "@/lib/subjects/catalog";

// Hand-written search snippets for subject pages. Titles stay under ~50 characters so the
// " · LearnerKits" suffix still fits in a results page; descriptions stay under ~160
// characters (about half that for CJK) so Google shows them without truncation.
// `n` is the live lab count so the number never drifts from the catalog.
type SubjectSeo = { title: string; description: (n: number) => string };
type VisibleSubject = "space" | "physics" | "geography" | "environmental-science" | "chemistry";

export const subjectSeo: Record<Locale, Record<VisibleSubject, SubjectSeo>> = {
  en: {
    space: { title: "Space & Astronomy Simulations for Students", description: (n) => `${n} interactive space lessons and 3D labs with guided activities, topic checks, on-device progress and optional AI tutor support for grades 7–12.` },
    physics: { title: "Physics Simulations & Virtual Labs", description: (n) => `${n} interactive physics labs with guided explanations, topic challenges, on-device progress and optional AI tutor support for students.` },
    geography: { title: "Earth Science & Geography Simulations", description: (n) => `${n} interactive Earth science labs with guided activities, topic checks, on-device progress and optional AI tutor support for grades 6–10.` },
    "environmental-science": { title: "Environmental Science & Climate Simulations", description: (n) => `${n} interactive climate labs with guided investigations, topic challenges, on-device progress and optional AI tutor support for students.` },
    chemistry: { title: "Chemistry Simulations & Virtual Labs", description: (n) => `${n} interactive chemistry labs with guided explanations, topic checks, on-device progress and optional AI tutor support for grades 8–12.` },
  },
  es: {
    space: { title: "Simulaciones de espacio y astronomía", description: (n) => `${n} lecciones y laboratorios 3D de espacio con actividades guiadas, comprobaciones, progreso local y apoyo opcional de un tutor de IA.` },
    physics: { title: "Simulaciones de física y laboratorios virtuales", description: (n) => `${n} laboratorios interactivos de física con explicaciones, retos, progreso guardado en el dispositivo y apoyo opcional de un tutor de IA.` },
    geography: { title: "Simulaciones de geografía y ciencias de la Tierra", description: (n) => `${n} laboratorios de ciencias de la Tierra con actividades, comprobaciones, progreso local y apoyo opcional de un tutor de IA.` },
    "environmental-science": { title: "Simulaciones de ciencias ambientales y clima", description: (n) => `${n} laboratorios interactivos del clima con investigaciones, retos, progreso local y apoyo opcional de un tutor de IA.` },
    chemistry: { title: "Simulaciones de química y laboratorios virtuales", description: (n) => `${n} laboratorios interactivos de química con explicaciones, comprobaciones, progreso local y apoyo opcional de un tutor de IA.` },
  },
  fr: {
    space: { title: "Simulations d’espace et d’astronomie", description: (n) => `${n} simulations gratuites sur l’espace : phases de la Lune, éclipses, lois de Kepler, orbites, vitesse de libération et alunissage en 3D.` },
    physics: { title: "Simulations de physique et labos virtuels", description: (n) => `${n} simulations de physique gratuites : forces, frottement, quantité de mouvement, circuits, lentilles, ondes et énergie. Changez les variables.` },
    geography: { title: "Simulations de géographie et sciences de la Terre", description: (n) => `${n} simulations gratuites en sciences de la Terre : tectonique des plaques, séismes, volcans, tsunamis, météo, érosion et cycle de l’eau.` },
    "environmental-science": { title: "Simulations d’environnement et de climat", description: (n) => `${n} simulations gratuites sur le climat et l’environnement : effet de serre, cycle du carbone, montée des mers, pollution et énergies renouvelables.` },
    chemistry: { title: "Simulations de chimie et labos virtuels", description: (n) => `${n} simulations de chimie gratuites : lois des gaz, vitesse de réaction, liaisons, pH, titrage, stœchiométrie et molécules en 3D.` },
  },
  de: {
    space: { title: "Simulationen zu Weltraum und Astronomie", description: (n) => `${n} kostenlose Weltraum-Simulationen: Mondphasen, Finsternisse, Keplersche Gesetze, Umlaufbahnen, Fluchtgeschwindigkeit und Mondlandung in 3D.` },
    physics: { title: "Physik-Simulationen und virtuelle Labore", description: (n) => `${n} kostenlose Physik-Simulationen zu Kräften, Reibung, Impuls, Stromkreisen, Linsen, Wellen und Energie. Variablen ändern und Ergebnisse sehen.` },
    geography: { title: "Simulationen zu Geographie und Geowissenschaften", description: (n) => `${n} kostenlose Geo-Simulationen zu Plattentektonik, Erdbeben, Vulkanen, Tsunamis, Wetter, Erosion und Wasserkreislauf. Für die Klassen 6–10.` },
    "environmental-science": { title: "Simulationen zu Umwelt und Klima", description: (n) => `${n} kostenlose Klima- und Umwelt-Simulationen: Treibhauseffekt, Kohlenstoffkreislauf, Meeresspiegelanstieg, Luftverschmutzung und erneuerbare Energie.` },
    chemistry: { title: "Chemie-Simulationen und virtuelle Labore", description: (n) => `${n} kostenlose Chemie-Simulationen zu Gasgesetzen, Reaktionsgeschwindigkeit, Bindungen, pH, Titration, Stöchiometrie und 3D-Molekülen.` },
  },
  pt: {
    space: { title: "Simulações de espaço e astronomia", description: (n) => `${n} simulações gratuitas de espaço: fases da Lua, eclipses, leis de Kepler, órbitas, velocidade de escape e pouso lunar em 3D.` },
    physics: { title: "Simulações de física e laboratórios virtuais", description: (n) => `${n} simulações gratuitas de física: forças, atrito, momento, circuitos, lentes, ondas e energia. Altere variáveis e veja os resultados.` },
    geography: { title: "Simulações de geografia e ciências da Terra", description: (n) => `${n} simulações gratuitas de ciências da Terra: placas tectônicas, terremotos, vulcões, tsunamis, clima, erosão e ciclo da água.` },
    "environmental-science": { title: "Simulações de ciências ambientais e clima", description: (n) => `${n} simulações gratuitas de clima e meio ambiente: efeito estufa, ciclo do carbono, aumento do nível do mar, poluição e energia renovável.` },
    chemistry: { title: "Simulações de química e laboratórios virtuais", description: (n) => `${n} simulações gratuitas de química: leis dos gases, velocidade de reação, ligações, pH, titulação, estequiometria e moléculas 3D.` },
  },
  ru: {
    space: { title: "Симуляции по космосу и астрономии", description: (n) => `${n} бесплатных симуляций по космосу: фазы Луны, затмения, законы Кеплера, орбиты, вторая космическая скорость и посадка на Луну в 3D.` },
    physics: { title: "Симуляции по физике и виртуальные лаборатории", description: (n) => `${n} бесплатных симуляций по физике: силы, трение, импульс, электрические цепи, линзы, волны и энергия. Меняйте переменные и смотрите результат.` },
    geography: { title: "Симуляции по географии и наукам о Земле", description: (n) => `${n} бесплатных симуляций о Земле: тектоника плит, землетрясения, вулканы, цунами, погода, эрозия и круговорот воды. Для 6–10 классов.` },
    "environmental-science": { title: "Симуляции по экологии и климату", description: (n) => `${n} бесплатных симуляций по климату и экологии: парниковый эффект, углеродный цикл, подъём уровня моря, загрязнение и возобновляемая энергия.` },
    chemistry: { title: "Симуляции по химии и виртуальные лаборатории", description: (n) => `${n} бесплатных симуляций по химии: газовые законы, скорость реакций, химические связи, pH, титрование, стехиометрия и 3D-молекулы.` },
  },
  ja: {
    space: { title: "宇宙・天文学シミュレーション", description: (n) => `月の満ち欠け、日食、ケプラーの法則、軌道、脱出速度、月面着陸を3Dで学べる無料の宇宙シミュレーション${n}本。` },
    physics: { title: "物理シミュレーション・バーチャル実験", description: (n) => `力、摩擦、運動量、電気回路、レンズ、波、エネルギーを変数を動かして学べる無料の物理シミュレーション${n}本。` },
    geography: { title: "地理・地学シミュレーション", description: (n) => `プレートテクトニクス、地震、火山、津波、天気、侵食、水の循環を学べる無料の地学シミュレーション${n}本。` },
    "environmental-science": { title: "環境科学・気候シミュレーション", description: (n) => `温室効果、炭素循環、海面上昇、大気汚染、再生可能エネルギーを学べる無料の環境・気候シミュレーション${n}本。` },
    chemistry: { title: "化学シミュレーション・バーチャル実験", description: (n) => `気体の法則、反応速度、化学結合、pH、滴定、化学量論、3D分子を学べる無料の化学シミュレーション${n}本。` },
  },
  zh: {
    space: { title: "太空与天文学互动模拟", description: (n) => `${n}个免费太空模拟：月相、日食、开普勒定律、轨道、逃逸速度和3D登月，适合7–12年级学生。` },
    physics: { title: "物理互动模拟与虚拟实验", description: (n) => `${n}个免费物理模拟：力、摩擦、动量、电路、透镜、波和能量。改变变量，观察结果，适合6–12年级学生。` },
    geography: { title: "地理与地球科学互动模拟", description: (n) => `${n}个免费地球科学模拟：板块构造、地震、火山、海啸、天气、侵蚀和水循环，适合6–10年级。` },
    "environmental-science": { title: "环境科学与气候互动模拟", description: (n) => `${n}个免费气候与环境模拟：温室效应、碳循环、海平面上升、空气污染和可再生能源，适合6–12年级。` },
    chemistry: { title: "化学互动模拟与虚拟实验", description: (n) => `${n}个免费化学模拟：气体定律、反应速率、化学键、pH、滴定、化学计量和3D分子。` },
  },
  ar: {
    space: { title: "محاكاة الفضاء وعلم الفلك للطلاب", description: (n) => `${n} محاكاة مجانية للفضاء: أطوار القمر والكسوف وقوانين كبلر والمدارات وسرعة الإفلات والهبوط على القمر بتقنية ثلاثية الأبعاد.` },
    physics: { title: "محاكاة الفيزياء والمختبرات الافتراضية", description: (n) => `${n} محاكاة فيزياء مجانية عن القوى والاحتكاك والزخم والدوائر الكهربائية والعدسات والموجات والطاقة. غيّر المتغيرات وشاهد النتائج.` },
    geography: { title: "محاكاة الجغرافيا وعلوم الأرض", description: (n) => `${n} محاكاة مجانية لعلوم الأرض: الصفائح التكتونية والزلازل والبراكين والتسونامي والطقس والتعرية ودورة المياه.` },
    "environmental-science": { title: "محاكاة العلوم البيئية والمناخ", description: (n) => `${n} محاكاة مجانية للمناخ والبيئة: الاحتباس الحراري ودورة الكربون وارتفاع مستوى البحر والتلوث والطاقة المتجددة.` },
    chemistry: { title: "محاكاة الكيمياء والمختبرات الافتراضية", description: (n) => `${n} محاكاة كيمياء مجانية عن قوانين الغازات وسرعة التفاعل والروابط والرقم الهيدروجيني والمعايرة والجزيئات ثلاثية الأبعاد.` },
  },
};

export function getSubjectSeo(locale: Locale, subject: SubjectSlug, labCount: number) {
  const entry = (subjectSeo[locale] as Partial<Record<SubjectSlug, SubjectSeo>>)[subject];
  return entry ? { title: entry.title, description: entry.description(labCount) } : undefined;
}
