"use client";
import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

// Shared drawing helpers for the interactive mathematics labs. Every stage is a 650 × 440 SVG
// so the labs line up with the original MathDisplay diagrams.
export const W = 650, H = 440;
export const colors = { blue: "#9fc2fa", amber: "#f0bd7e", pink: "#f29bb6", green: "#8fdcb4", violet: "#c6a8f5", muted: "#a8b5c8", grid: "#33425a", axis: "#7d8ea8", white: "#f4f8ff" };

export type Plot = { x0: number; x1: number; y0: number; y1: number; left: number; right: number; top: number; bottom: number };
/** Maps math coordinates onto the stage. Equal scale on both axes when `equal` is true. */
export function makePlot(x0: number, x1: number, y0: number, y1: number, box = { left: 50, right: 600, top: 30, bottom: 410 }, equal = false): Plot {
  if (!equal) return { x0, x1, y0, y1, ...box };
  const sx = (box.right - box.left) / (x1 - x0), sy = (box.bottom - box.top) / (y1 - y0), s = Math.min(sx, sy);
  const w = (x1 - x0) * s, h = (y1 - y0) * s, cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2;
  return { x0, x1, y0, y1, left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2 };
}
export const px = (p: Plot, x: number) => p.left + ((x - p.x0) / (p.x1 - p.x0)) * (p.right - p.left);
export const py = (p: Plot, y: number) => p.bottom - ((y - p.y0) / (p.y1 - p.y0)) * (p.bottom - p.top);
export const unpx = (p: Plot, sx: number) => p.x0 + ((sx - p.left) / (p.right - p.left)) * (p.x1 - p.x0);
export const unpy = (p: Plot, sy: number) => p.y0 + ((p.bottom - sy) / (p.bottom - p.top)) * (p.y1 - p.y0);

/** Grid with labelled integer ticks every `step` units and bold axes through the origin. */
export function Grid({ plot, step = 1, labelEvery = 1 }: { plot: Plot; step?: number; labelEvery?: number }) {
  const xs: number[] = [], ys: number[] = [];
  for (let x = Math.ceil(plot.x0 / step) * step; x <= plot.x1 + 1e-9; x += step) xs.push(+x.toFixed(6));
  for (let y = Math.ceil(plot.y0 / step) * step; y <= plot.y1 + 1e-9; y += step) ys.push(+y.toFixed(6));
  const ax = Math.min(Math.max(0, plot.x0), plot.x1), ay = Math.min(Math.max(0, plot.y0), plot.y1);
  const label = (n: number) => Math.round(n / step) % labelEvery === 0 && n !== 0;
  return <g fontSize="11" fill={colors.muted}>
    {xs.map((x) => <line key={`x${x}`} x1={px(plot, x)} x2={px(plot, x)} y1={plot.top} y2={plot.bottom} stroke={colors.grid} strokeWidth="1" />)}
    {ys.map((y) => <line key={`y${y}`} y1={py(plot, y)} y2={py(plot, y)} x1={plot.left} x2={plot.right} stroke={colors.grid} strokeWidth="1" />)}
    <line x1={px(plot, ax)} x2={px(plot, ax)} y1={plot.top} y2={plot.bottom} stroke={colors.axis} strokeWidth="1.5" />
    <line y1={py(plot, ay)} y2={py(plot, ay)} x1={plot.left} x2={plot.right} stroke={colors.axis} strokeWidth="1.5" />
    {xs.filter(label).map((x) => <text key={`lx${x}`} x={px(plot, x)} y={py(plot, ay) + 15} textAnchor="middle">{x}</text>)}
    {ys.filter(label).map((y) => <text key={`ly${y}`} x={px(plot, ax) - 7} y={py(plot, y) + 4} textAnchor="end">{y}</text>)}
  </g>;
}

/** Stage frame: dark radial background, arrow markers (url(#lab-arrow-blue) etc.) and a clip. */
export function Stage({ children, label, svgRef, onPointerMove, onPointerUp }: { children: ReactNode; label: string; svgRef?: React.Ref<SVGSVGElement>; onPointerMove?: (e: ReactPointerEvent<SVGSVGElement>) => void; onPointerUp?: () => void }) {
  return <div className="mathDiagram"><svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} style={{ touchAction: "none", userSelect: "none" }}>
    <defs>
      <radialGradient id="lab-bg"><stop stopColor="#344258" /><stop offset="1" stopColor="#1b242f" /></radialGradient>
      {Object.entries(colors).map(([name, color]) => <marker key={name} id={`lab-arrow-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5 0 10Z" fill={color} /></marker>)}
    </defs>
    <rect width={W} height={H} fill="url(#lab-bg)" />
    <g fill={colors.muted} fontFamily="inherit" fontSize="13">{children}</g>
  </svg></div>;
}

/**
 * Pointer dragging in SVG coordinates. `start(id)` goes on a handle's onPointerDown; the returned
 * move/end handlers go on the <Stage>. `onDrag` receives the id and the pointer in stage units.
 */
export function useDrag<T extends string>(onDrag: (id: T, x: number, y: number) => void) {
  const svgRef = useRef<SVGSVGElement>(null), active = useRef<T | null>(null);
  const point = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current, m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: Math.max(0, Math.min(W, p.x)), y: Math.max(0, Math.min(H, p.y)) };
  };
  const start = useCallback((id: T) => (e: ReactPointerEvent<SVGElement>) => { e.preventDefault(); active.current = id; svgRef.current?.setPointerCapture?.(e.pointerId); const p = point(e); if (p) onDrag(id, p.x, p.y); }, [onDrag]);
  const move = useCallback((e: ReactPointerEvent<SVGSVGElement>) => { if (!active.current) return; const p = point(e); if (p) onDrag(active.current, p.x, p.y); }, [onDrag]);
  const end = useCallback(() => { active.current = null; }, []);
  return { svgRef, start, move, end };
}

/** A round draggable handle with a large invisible hit area for touch. */
export function Handle({ x, y, color = colors.amber, onPointerDown, label }: { x: number; y: number; color?: string; onPointerDown: (e: ReactPointerEvent<SVGElement>) => void; label: string }) {
  return <g style={{ cursor: "grab" }} onPointerDown={onPointerDown} role="slider" aria-label={label} tabIndex={-1}>
    <circle cx={x} cy={y} r="20" fill="transparent" />
    <circle cx={x} cy={y} r="9" fill={color} stroke="#18202b" strokeWidth="3" />
  </g>;
}

/** Clips children to the plot rectangle so lines stop at the edge of the grid. */
export function PlotClip({ plot, id, children }: { plot: Plot; id: string; children: ReactNode }) {
  return <><clipPath id={id}><rect x={plot.left} y={plot.top} width={plot.right - plot.left} height={plot.bottom - plot.top} /></clipPath><g clipPath={`url(#${id})`}>{children}</g></>;
}

/** Fixed decimals with a true minus sign; "—" for NaN or infinity. Tiny negatives print as 0. */
export const fmt = (n: number, d = 2) => {
  if (!Number.isFinite(n)) return "—";
  const text = n.toFixed(d);
  return Number(text) === 0 ? (0).toFixed(d) : text.replace("-", "−");
};
