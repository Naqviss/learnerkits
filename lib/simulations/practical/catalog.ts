import { investigations, investigationSlugs } from "./investigations";
import type { SimulationCard } from "@/lib/subjects/catalog";

function lab(slug: string, title: string, concepts: string, outcome: string, game = false): SimulationCard {
  return { slug, title, concepts, outcome, kind: game ? "Geography game" : "Interactive experiment", difficulty: "Intermediate", duration: "5–10 min", visualMode: game ? "game" : "simulation" };
}

function investigationCards(subject: string) {
  return investigationSlugs.filter(slug => investigations[slug].subject === subject).map(slug => {
    const item = investigations[slug];
    return { ...lab(slug, item.title, item.keywords, item.description), seoTarget: item.keywords.split(" · ")[0] };
  });
}

export const practicalLabs = {
  physics: [
    lab("gravity-planet-orbit", "Gravity & Planet Orbit Simulator", "Gravity · orbital speed · trajectories", "Keep launch speed fixed and discover which gravitational pull produces a circular orbit."),
    lab("n-body-space", "N-Body Space Simulation", "Mutual gravity · collisions · momentum", "Release a cluster of up to 100 bodies and measure how many merge under mutual gravity."),
    lab("pendulum-wave", "Satisfying Physics Simulation", "Pendulum waves · period · phase", "Tune a row of pendulums to drift out of phase and swing back into alignment."),
    ...investigationCards("physics"),
  ],
  "environmental-science": [
    lab("ecosystem-survival", "Ecosystem Simulation", "Carrying capacity · predators · prey", "Test whether a predator and its prey can coexist for 1,000 model years."),
    lab("climate-change-scenarios", "Climate Change Simulator", "Global warming · snow line · mountain habitats", "Raise global temperature by 3°C and estimate how far a mountain habitat boundary shifts."),
    lab("aquarium-food-web", "Aquarium Ecosystem Simulator", "Algae · grazers · food webs", "Remove one species from a tank and track the effects across three trophic levels."),
    ...investigationCards("environmental-science"),
  ],
  geography: [
    lab("country-shape-quiz", "Interactive Geography Game", "Country outlines · regions · recognition", "Identify countries from their outlines and use regional clues to correct your guesses.", true),
    lab("world-border-lab", "World Map & Country Simulator", "Borders · territory · longitude", "Move a fictional border and discover which countries it divides."),
    lab("geography-field-detective", "Geography Field Detective", "Location clues · landforms · spatial reasoning", "Infer a location from field observations as the number of possible destinations grows.", true),
    ...investigationCards("geography"),
  ],
};

export const practicalSlugs = new Set(Object.values(practicalLabs).flat().map(lab => lab.slug));
