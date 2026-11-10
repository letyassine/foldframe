export type CanvasBackground = "grid" | "midnight" | "plum" | "light";

export interface CanvasBackgroundOption {
  id: CanvasBackground;
  label: string;
  className: string;
  swatch: string;
}

export const CANVAS_BACKGROUNDS: CanvasBackgroundOption[] = [
  {
    id: "grid",
    label: "Grid",
    className: "canvas-grid",
    swatch: "linear-gradient(135deg, #12151a, #070809)",
  },
  {
    id: "midnight",
    label: "Midnight",
    className: "canvas-midnight",
    swatch: "linear-gradient(135deg, #1a2a6b, #070a12)",
  },
  {
    id: "plum",
    label: "Plum",
    className: "canvas-plum",
    swatch: "linear-gradient(135deg, #6b2a7a, #0c0710)",
  },
  {
    id: "light",
    label: "Paper",
    className: "canvas-light",
    swatch: "linear-gradient(135deg, #f7f5f0, #d8d4cc)",
  },
];

export function canvasBackgroundClass(background: CanvasBackground): string {
  return (
    CANVAS_BACKGROUNDS.find((option) => option.id === background)?.className ??
    "canvas-grid"
  );
}

export function isLightBackground(background: CanvasBackground): boolean {
  return background === "light";
}
