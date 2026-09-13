import type { Locale } from "@/lib/i18n/config";
import type { SimulationCard, SubjectDefinition } from "@/lib/subjects/catalog";

type GuideCopy = {
  freeLabel: string;
  title: (title: string) => string;
  intro: (kind: string, outcome: string, gradeBand: string) => string;
  investigate: string;
  investigateBody: (concepts: string) => string;
  howTo: string;
  steps: [string, string, string, string];
  classroom: string;
  classroomBody: (duration: string) => string;
  questions: string;
  teachesQuestion: (title: string) => string;
  teachesAnswer: (outcome: string, concepts: string) => string;
  freeQuestion: (title: string) => string;
  freeAnswer: string;
  timeQuestion: string;
  timeAnswer: (duration: string) => string;
  related: (subject: string) => string;
  open: string;
  level: string;
  time: string;
  format: string;
};

const en: GuideCopy = {
  freeLabel: "Free online interactive learning",
  title: (title) => `${title}: experiment guide`,
  intro: (kind, outcome, gradeBand) => `This browser-based ${kind.toLowerCase()} helps you ${lowerFirst(outcome)} Designed for ${gradeBand}, it turns an abstract idea into a model you can control, measure, reset, and test without signing up.`,
  investigate: "What you can investigate",
  investigateBody: (concepts) => `Explore ${concepts} by changing the available controls and comparing the model’s visual and numerical evidence. Try one variable at a time, then combine changes to test a stronger explanation.`,
  howTo: "How to use this simulation",
  steps: [
    "Read the mission and make a prediction before moving a control.",
    "Change one variable so its effect is easier to identify.",
    "Run the model and record a value, pattern, or visible change.",
    "Reset, test a different setup, and explain the result from evidence.",
  ],
  classroom: "For students, teachers, and independent study",
  classroomBody: (duration) => `A typical investigation takes ${duration}. Use it as a lesson demonstration, a guided inquiry activity, a homework experiment, or a quick review. The simulation runs in a modern web browser and does not require an account.`,
  questions: "Common questions",
  teachesQuestion: (title) => `What does the ${title} teach?`,
  teachesAnswer: (outcome, concepts) => `${outcome} The main ideas are ${concepts}.`,
  freeQuestion: (title) => `Is the ${title} free to use?`,
  freeAnswer: "Yes. You can run the simulation online for free without creating an account.",
  timeQuestion: "How long does the activity take?",
  timeAnswer: (duration) => `Most learners can complete one investigation in ${duration}. You can repeat it to compare more variables or improve your explanation.`,
  related: (subject) => `More interactive ${subject} activities`,
  open: "Open simulation",
  level: "Level",
  time: "Time",
  format: "Format",
};

const copies: Record<Locale, GuideCopy> = {
  en,
  es: { ...en, freeLabel:"Aprendizaje interactivo gratuito en línea", title:t=>`${t}: guía del experimento`, intro:(k,o,g)=>`Esta actividad de ${k.toLowerCase()} funciona en el navegador y te ayuda a ${lowerFirst(o)} Está diseñada para ${g} y permite controlar, medir, reiniciar y probar el modelo sin registrarte.`, investigate:"Qué puedes investigar", investigateBody:c=>`Explora ${c} cambiando los controles y comparando la evidencia visual y numérica. Cambia primero una sola variable y luego combina cambios para comprobar una explicación.`, howTo:"Cómo usar esta simulación", steps:["Lee la misión y haz una predicción antes de mover un control.","Cambia una variable para identificar mejor su efecto.","Ejecuta el modelo y registra un valor, patrón o cambio visible.","Reinicia, prueba otra configuración y explica el resultado con evidencia."], classroom:"Para estudiantes, docentes y estudio independiente", classroomBody:d=>`Una investigación suele durar ${d}. Úsala como demostración, actividad guiada, tarea o repaso. Funciona en un navegador moderno y no requiere cuenta.`, questions:"Preguntas frecuentes", teachesQuestion:t=>`¿Qué enseña ${t}?`, teachesAnswer:(o,c)=>`${o} Las ideas principales son ${c}.`, freeQuestion:t=>`¿${t} es gratis?`, freeAnswer:"Sí. Puedes usar la simulación en línea gratis y sin crear una cuenta.", timeQuestion:"¿Cuánto dura la actividad?", timeAnswer:d=>`La mayoría de estudiantes completa una investigación en ${d}. Puedes repetirla para comparar más variables.`, related:s=>`Más actividades interactivas de ${s}`, open:"Abrir simulación", level:"Nivel", time:"Tiempo", format:"Formato" },
  fr: { ...en, freeLabel:"Apprentissage interactif gratuit en ligne", title:t=>`${t} : guide d’expérimentation`, intro:(k,o,g)=>`Cette activité de type ${k.toLowerCase()} fonctionne dans le navigateur et vous aide à ${lowerFirst(o)} Conçue pour ${g}, elle permet de contrôler, mesurer, réinitialiser et tester le modèle sans inscription.`, investigate:"Ce que vous pouvez étudier", investigateBody:c=>`Explorez ${c} en modifiant les commandes et en comparant les observations visuelles et numériques. Changez d’abord une seule variable, puis combinez les changements pour tester votre explication.`, howTo:"Comment utiliser cette simulation", steps:["Lisez la mission et faites une prédiction avant de modifier un réglage.","Changez une variable pour mieux identifier son effet.","Lancez le modèle et relevez une valeur, un motif ou un changement visible.","Réinitialisez, testez une autre configuration et expliquez le résultat avec des preuves."], classroom:"Pour les élèves, les enseignants et l’étude autonome", classroomBody:d=>`Une investigation dure généralement ${d}. Utilisez-la comme démonstration, activité guidée, devoir ou révision. Aucun compte n’est nécessaire.`, questions:"Questions fréquentes", teachesQuestion:t=>`Qu’enseigne ${t} ?`, teachesAnswer:(o,c)=>`${o} Les idées principales sont ${c}.`, freeQuestion:t=>`${t} est-il gratuit ?`, freeAnswer:"Oui. La simulation est gratuite en ligne et ne demande aucun compte.", timeQuestion:"Combien de temps dure l’activité ?", timeAnswer:d=>`La plupart des élèves terminent une investigation en ${d}. Elle peut être répétée pour comparer davantage de variables.`, related:s=>`Plus d’activités interactives en ${s}`, open:"Ouvrir la simulation", level:"Niveau", time:"Durée", format:"Format" },
  de: { ...en, freeLabel:"Kostenloses interaktives Online-Lernen", title:t=>`${t}: Experimentieranleitung`, intro:(k,o,g)=>`Diese browserbasierte Aktivität vom Typ ${k.toLowerCase()} hilft dir dabei: ${o} Sie ist für ${g} ausgelegt und lässt sich ohne Anmeldung steuern, messen, zurücksetzen und testen.`, investigate:"Was du untersuchen kannst", investigateBody:c=>`Untersuche ${c}, indem du die Regler veränderst und visuelle sowie numerische Ergebnisse vergleichst. Ändere zuerst nur eine Variable und kombiniere danach Änderungen, um deine Erklärung zu prüfen.`, howTo:"So verwendest du die Simulation", steps:["Lies die Mission und stelle eine Vermutung auf.","Ändere eine Variable, damit ihre Wirkung erkennbar bleibt.","Starte das Modell und notiere einen Wert, ein Muster oder eine sichtbare Änderung.","Setze zurück, teste eine andere Einstellung und erkläre das Ergebnis mit Belegen."], classroom:"Für Lernende, Lehrkräfte und selbstständiges Lernen", classroomBody:d=>`Eine Untersuchung dauert normalerweise ${d}. Nutze sie als Demonstration, Unterrichtsaufgabe, Hausaufgabe oder Wiederholung. Ein Konto ist nicht erforderlich.`, questions:"Häufige Fragen", teachesQuestion:t=>`Was vermittelt ${t}?`, teachesAnswer:(o,c)=>`${o} Die wichtigsten Konzepte sind ${c}.`, freeQuestion:t=>`Ist ${t} kostenlos?`, freeAnswer:"Ja. Die Simulation kann kostenlos und ohne Konto online genutzt werden.", timeQuestion:"Wie lange dauert die Aktivität?", timeAnswer:d=>`Die meisten Lernenden schließen eine Untersuchung in ${d} ab. Für weitere Vergleiche kann sie wiederholt werden.`, related:s=>`Weitere interaktive Aktivitäten zu ${s}`, open:"Simulation öffnen", level:"Stufe", time:"Zeit", format:"Format" },
  pt: { ...en, freeLabel:"Aprendizagem interativa gratuita online", title:t=>`${t}: guia do experimento`, intro:(k,o,g)=>`Esta atividade de ${k.toLowerCase()} funciona no navegador e ajuda você a ${lowerFirst(o)} Criada para ${g}, ela permite controlar, medir, reiniciar e testar o modelo sem cadastro.`, investigate:"O que você pode investigar", investigateBody:c=>`Explore ${c} alterando os controles e comparando evidências visuais e numéricas. Mude primeiro uma variável e depois combine alterações para testar uma explicação.`, howTo:"Como usar esta simulação", steps:["Leia a missão e faça uma previsão antes de alterar um controle.","Mude uma variável para identificar melhor seu efeito.","Execute o modelo e registre um valor, padrão ou mudança visível.","Reinicie, teste outra configuração e explique o resultado com evidências."], classroom:"Para estudantes, professores e estudo independente", classroomBody:d=>`Uma investigação costuma levar ${d}. Use como demonstração, atividade guiada, tarefa ou revisão. Não é necessário criar uma conta.`, questions:"Perguntas comuns", teachesQuestion:t=>`O que ${t} ensina?`, teachesAnswer:(o,c)=>`${o} As ideias principais são ${c}.`, freeQuestion:t=>`${t} é gratuito?`, freeAnswer:"Sim. Você pode usar a simulação online gratuitamente e sem criar uma conta.", timeQuestion:"Quanto tempo dura a atividade?", timeAnswer:d=>`A maioria dos estudantes conclui uma investigação em ${d}. Repita para comparar mais variáveis.`, related:s=>`Mais atividades interativas de ${s}`, open:"Abrir simulação", level:"Nível", time:"Tempo", format:"Formato" },
  ru: { ...en, freeLabel:"Бесплатное интерактивное обучение онлайн", title:t=>`${t}: руководство к эксперименту`, intro:(k,o,g)=>`Эта браузерная модель (${k.toLowerCase()}) помогает выполнить задачу: ${o} Она рассчитана на ${g}; модель можно запускать, измерять и сбрасывать без регистрации.`, investigate:"Что можно исследовать", investigateBody:c=>`Исследуйте ${c}, меняя параметры и сравнивая визуальные и числовые данные. Сначала меняйте одну переменную, затем объединяйте изменения для проверки объяснения.`, howTo:"Как пользоваться симуляцией", steps:["Прочитайте задание и сделайте прогноз до изменения параметров.","Измените одну переменную, чтобы увидеть её влияние.","Запустите модель и запишите значение, закономерность или видимое изменение.","Сбросьте модель, проверьте другую настройку и объясните результат данными."], classroom:"Для учеников, учителей и самостоятельной работы", classroomBody:d=>`Обычно исследование занимает ${d}. Используйте модель для демонстрации, практической работы, домашнего задания или повторения. Учётная запись не нужна.`, questions:"Частые вопросы", teachesQuestion:t=>`Чему учит ${t}?`, teachesAnswer:(o,c)=>`${o} Основные понятия: ${c}.`, freeQuestion:t=>`${t} доступна бесплатно?`, freeAnswer:"Да. Симуляцию можно бесплатно запускать онлайн без создания аккаунта.", timeQuestion:"Сколько длится занятие?", timeAnswer:d=>`Большинство учеников выполняет одно исследование за ${d}. Его можно повторить для сравнения переменных.`, related:s=>`Другие интерактивные задания: ${s}`, open:"Открыть симуляцию", level:"Уровень", time:"Время", format:"Формат" },
  ja: { ...en, freeLabel:"無料オンライン・インタラクティブ学習", title:t=>`${t}：実験ガイド`, intro:(k,o,g)=>`このブラウザ上の${k}では、${o} ${g}向けに設計され、登録せずにモデルを操作、測定、リセットして検証できます。`, investigate:"調べられること", investigateBody:c=>`操作項目を変え、視覚的・数値的な証拠を比較しながら、${c}を探究します。まず一つの変数を変え、次に複数の変化を組み合わせて説明を検証しましょう。`, howTo:"シミュレーションの使い方", steps:["操作前にミッションを読み、結果を予想します。","影響を見分けやすくするため、一つの変数を変えます。","モデルを実行し、値、パターン、見た目の変化を記録します。","リセットして別の設定を試し、証拠から結果を説明します。"], classroom:"生徒・教師・自習向け", classroomBody:d=>`通常の探究時間は${d}です。授業での実演、探究活動、宿題、復習に利用でき、アカウントは不要です。`, questions:"よくある質問", teachesQuestion:t=>`${t}では何を学べますか？`, teachesAnswer:(o,c)=>`${o} 主な概念は${c}です。`, freeQuestion:t=>`${t}は無料ですか？`, freeAnswer:"はい。アカウントを作成せず、オンラインで無料で利用できます。", timeQuestion:"活動時間はどのくらいですか？", timeAnswer:d=>`多くの学習者は${d}で一回の探究を終えられます。変数の比較のため繰り返すこともできます。`, related:s=>`${s}の関連インタラクティブ活動`, open:"シミュレーションを開く", level:"レベル", time:"時間", format:"形式" },
  zh: { ...en, freeLabel:"免费在线互动学习", title:t=>`${t}：实验指南`, intro:(k,o,g)=>`这个基于浏览器的${k}可帮助你完成以下目标：${o} 它面向${g}，无需注册即可控制、测量、重置和检验模型。`, investigate:"你可以研究什么", investigateBody:c=>`通过改变控制项并比较视觉和数值证据来探索${c}。先只改变一个变量，再组合不同变化来检验你的解释。`, howTo:"如何使用此模拟", steps:["调整控制项前，先阅读任务并作出预测。","每次改变一个变量，以便识别它的影响。","运行模型并记录数值、规律或可见变化。","重置后尝试另一组条件，并用证据解释结果。"], classroom:"适合学生、教师和自主学习", classroomBody:d=>`一次研究通常需要${d}。可用于课堂演示、探究活动、家庭作业或复习，无需账户。`, questions:"常见问题", teachesQuestion:t=>`${t}讲授什么？`, teachesAnswer:(o,c)=>`${o} 主要概念包括${c}。`, freeQuestion:t=>`${t}可以免费使用吗？`, freeAnswer:"可以。无需创建账户即可免费在线运行模拟。", timeQuestion:"活动需要多长时间？", timeAnswer:d=>`大多数学习者可在${d}内完成一次研究，也可以重复实验来比较更多变量。`, related:s=>`更多${s}互动活动`, open:"打开模拟", level:"难度", time:"时间", format:"形式" },
  ar: { ...en, freeLabel:"تعلم تفاعلي مجاني عبر الإنترنت", title:t=>`${t}: دليل التجربة`, intro:(k,o,g)=>`يساعدك نشاط ${k} هذا في المتصفح على تحقيق الهدف التالي: ${o} وهو مصمم لـ${g} ويمكن التحكم في النموذج وقياسه وإعادة ضبطه دون تسجيل.`, investigate:"ما الذي يمكنك استقصاؤه", investigateBody:c=>`استكشف ${c} بتغيير أدوات التحكم ومقارنة الأدلة المرئية والعددية. غيّر متغيرًا واحدًا أولًا، ثم اجمع التغييرات لاختبار تفسيرك.`, howTo:"كيفية استخدام المحاكاة", steps:["اقرأ المهمة وتوقع النتيجة قبل تغيير أي عنصر تحكم.","غيّر متغيرًا واحدًا لتحديد أثره بوضوح.","شغّل النموذج وسجّل قيمة أو نمطًا أو تغيرًا مرئيًا.","أعد الضبط واختبر إعدادًا آخر واشرح النتيجة بالأدلة."], classroom:"للطلاب والمعلمين والدراسة المستقلة", classroomBody:d=>`يستغرق الاستقصاء عادةً ${d}. استخدمه للعرض أو النشاط الموجّه أو الواجب أو المراجعة. لا يلزم إنشاء حساب.`, questions:"أسئلة شائعة", teachesQuestion:t=>`ماذا تعلم محاكاة ${t}؟`, teachesAnswer:(o,c)=>`${o} المفاهيم الأساسية هي ${c}.`, freeQuestion:t=>`هل ${t} مجانية؟`, freeAnswer:"نعم. يمكنك تشغيل المحاكاة مجانًا عبر الإنترنت دون إنشاء حساب.", timeQuestion:"كم يستغرق النشاط؟", timeAnswer:d=>`يمكن لمعظم المتعلمين إكمال استقصاء واحد خلال ${d}، ويمكن تكراره لمقارنة مزيد من المتغيرات.`, related:s=>`أنشطة ${s} تفاعلية أخرى`, open:"فتح المحاكاة", level:"المستوى", time:"المدة", format:"الصيغة" },
};

function lowerFirst(value: string) {
  return value ? value[0].toLocaleLowerCase() + value.slice(1) : value;
}

export type SimulationGuide = {
  freeLabel: string;
  title: string;
  intro: string;
  investigate: string;
  investigateBody: string;
  howTo: string;
  steps: string[];
  classroom: string;
  classroomBody: string;
  questions: string;
  faq: { q: string; a: string }[];
  related: string;
  open: string;
  level: string;
  time: string;
  format: string;
};

export function getSimulationGuide(locale: Locale, subject: SubjectDefinition, simulation: SimulationCard): SimulationGuide {
  const copy = copies[locale];
  const concepts = simulation.concepts.replaceAll(" · ", ", ");
  return {
    freeLabel: locale === "en" && simulation.seoTarget ? `Free online ${simulation.seoTarget}` : copy.freeLabel,
    title: copy.title(simulation.title),
    intro: copy.intro(simulation.kind, simulation.outcome, subject.gradeBand),
    investigate: copy.investigate,
    investigateBody: copy.investigateBody(concepts),
    howTo: copy.howTo,
    steps: copy.steps,
    classroom: copy.classroom,
    classroomBody: copy.classroomBody(simulation.duration),
    questions: copy.questions,
    faq: [
      { q: copy.teachesQuestion(simulation.title), a: copy.teachesAnswer(simulation.outcome, concepts) },
      { q: copy.freeQuestion(simulation.title), a: copy.freeAnswer },
      { q: copy.timeQuestion, a: copy.timeAnswer(simulation.duration) },
    ],
    related: copy.related(subject.eyebrow),
    open: copy.open,
    level: copy.level,
    time: copy.time,
    format: copy.format,
  };
}
