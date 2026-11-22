import type { ReactNode } from "react";

export function PracticalWorkspace({ scene, children }: { scene: ReactNode; children: ReactNode }) {
  return <div className="simLayout practicalLab">
    <section className="simViewport practicalViewport" aria-label="Simulation view">{scene}</section>
    <aside className="hud practicalControls" aria-label="Activity controls">{children}</aside>
  </div>;
}
