"use client";

import type { ReactNode } from "react";
import {
  Frame,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  Tablet,
} from "lucide-react";
import {
  CANVAS_BACKGROUNDS,
  type CanvasBackground,
} from "@/lib/canvas";
import type { DeviceMode, Orientation } from "@/lib/devices";
import { cn } from "@/lib/utils";

interface ControlBarProps {
  mode: DeviceMode;
  canFold: boolean;
  orientation: Orientation;
  showFrame: boolean;
  background: CanvasBackground;
  onModeChange: (mode: DeviceMode) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onToggleFrame: () => void;
  onBackgroundChange: (background: CanvasBackground) => void;
}

function SegmentButton({
  active,
  disabled,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium transition-colors duration-150 ease-snappy motion-safe:active:scale-[0.96]",
        active
          ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-muted hover:text-zinc-200",
        disabled && "cursor-not-allowed opacity-30 hover:text-muted",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function IconButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid size-7 place-items-center rounded-lg transition-colors duration-150 ease-snappy motion-safe:active:scale-[0.96]",
        active
          ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-muted hover:bg-white/[0.04] hover:text-zinc-200",
      )}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-line" />;
}

export function ControlBar({
  mode,
  canFold,
  orientation,
  showFrame,
  background,
  onModeChange,
  onOrientationChange,
  onToggleFrame,
  onBackgroundChange,
}: ControlBarProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-0.5 rounded-2xl border border-line bg-panel/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="flex shrink-0 items-center gap-0.5 rounded-xl bg-canvas/60 p-0.5">
          <SegmentButton
            active={mode === "folded"}
            disabled={!canFold}
            onClick={() => onModeChange("folded")}
            icon={<Smartphone className="size-3.5" />}
            label="Folded"
          />
          <SegmentButton
            active={mode === "unfolded"}
            onClick={() => onModeChange("unfolded")}
            icon={<Tablet className="size-3.5" />}
            label="Unfolded"
          />
        </div>

        <Divider />

        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton
            active={orientation === "portrait"}
            onClick={() => onOrientationChange("portrait")}
            label="Portrait (O)"
            icon={<RectangleVertical className="size-3.5" />}
          />
          <IconButton
            active={orientation === "landscape"}
            onClick={() => onOrientationChange("landscape")}
            label="Landscape (O)"
            icon={<RectangleHorizontal className="size-3.5" />}
          />
        </div>

        <Divider />

        <IconButton
          active={showFrame}
          onClick={onToggleFrame}
          label="Device frame (F)"
          icon={<Frame className="size-3.5" />}
        />

        <Divider />

        <div className="flex shrink-0 items-center gap-1.5 px-1.5">
          {CANVAS_BACKGROUNDS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onBackgroundChange(option.id)}
              title={`${option.label} background`}
              aria-label={`${option.label} background`}
              aria-pressed={background === option.id}
              className={cn(
                "size-6 rounded-full border transition-colors duration-150 ease-snappy",
                background === option.id
                  ? "border-accent ring-2 ring-accent/25"
                  : "border-white/20 hover:border-white/40",
              )}
              style={{ background: option.swatch }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
