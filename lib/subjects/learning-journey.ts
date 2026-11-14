import type { Locale } from "@/lib/i18n/config";

type JourneyCard = {
  icon: string;
  title: string;
  body: string;
  badge?: string;
};

type LearningJourneyCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cards: JourneyCard[];
  progressNote: string;
  start: string;
  premium: string;
};

const copy: Record<"en" | "es", LearningJourneyCopy> = {
  en: {
    eyebrow: "A complete learning journey",
    title: "More than a simulation: learn, ask, practise and improve",
    body: "Use each subject as a connected study path. Build the idea in clear language, explore it interactively, check your understanding and use saved activity evidence to decide what to study next.",
    cards: [
      { icon: "文", title: "Learn in your language", body: "Read the subject goals, learning outcomes and activity instructions in the language selected for the site." },
      { icon: "01", title: "Build topic understanding", body: "Start with the learning objective and concept, then move through focused activities instead of browsing disconnected tools." },
      { icon: "✦", title: "Ask the topic-aware AI tutor", body: "Premium learners can ask questions inside a simulation. The tutor receives the current topic context and can explain the idea or suggest what to try next.", badge: "Premium" },
      { icon: "✓", title: "Test your understanding", body: "Use built-in missions, checks and questions where available to apply the concept and receive immediate feedback." },
      { icon: "↗", title: "See learning progress", body: "Supported activities and subject notebooks save completed missions, evidence and scores in this browser so you can see what you have practised." },
      { icon: "◎", title: "Learn through interaction", body: "Change variables, compare outcomes and use measurements, graphs or visible changes as evidence for your explanation." },
    ],
    progressNote: "Progress is currently stored on this device for supported activities. It does not automatically sync between browsers or devices.",
    start: "Start with a subject activity",
    premium: "See AI tutor access",
  },
  es: {
    eyebrow: "Un recorrido de aprendizaje completo",
    title: "Más que una simulación: aprende, pregunta, practica y mejora",
    body: "Usa cada materia como una ruta de estudio conectada. Comprende la idea con lenguaje claro, explórala de forma interactiva, comprueba lo aprendido y usa la evidencia guardada para decidir qué estudiar después.",
    cards: [
      { icon: "文", title: "Aprende en tu idioma", body: "Lee los objetivos, resultados de aprendizaje e instrucciones de las actividades en el idioma elegido para el sitio." },
      { icon: "01", title: "Comprende cada tema", body: "Empieza por el objetivo y el concepto, y avanza por actividades enfocadas en vez de usar herramientas desconectadas." },
      { icon: "✦", title: "Pregunta al tutor de IA del tema", body: "Los estudiantes Premium pueden preguntar dentro de una simulación. El tutor recibe el contexto del tema y puede explicarlo o sugerir el siguiente paso.", badge: "Premium" },
      { icon: "✓", title: "Comprueba lo que sabes", body: "Usa misiones, comprobaciones y preguntas disponibles para aplicar el concepto y recibir comentarios inmediatos." },
      { icon: "↗", title: "Consulta tu progreso", body: "Las actividades compatibles y los cuadernos guardan en este navegador las misiones, evidencias y puntuaciones practicadas." },
      { icon: "◎", title: "Aprende de forma interactiva", body: "Cambia variables, compara resultados y usa mediciones, gráficos o cambios visibles como evidencia para tu explicación." },
    ],
    progressNote: "El progreso de las actividades compatibles se guarda actualmente en este dispositivo. No se sincroniza automáticamente entre navegadores o dispositivos.",
    start: "Empieza una actividad de la materia",
    premium: "Ver acceso al tutor de IA",
  },
};

export function getLearningJourneyCopy(locale: Locale): LearningJourneyCopy {
  return locale === "es" ? copy.es : copy.en;
}
