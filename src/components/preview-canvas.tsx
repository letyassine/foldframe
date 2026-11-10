"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Layers, Minus, Plus, ScanLine } from "lucide-react";
import {
  MAX_DEVICES,
  type Device,
  type DeviceMode,
  type Orientation,
  getBodySize,
  resolveMode,
} from "@/lib/devices";
import {
  type CanvasBackground,
  canvasBackgroundClass,
  isLightBackground,
} from "@/lib/canvas";
import { clamp, cn } from "@/lib/utils";
import { DevicePreview } from "./device-preview";

const DEVICE_GAP = 46;

interface PreviewCanvasProps {
  devices: Device[];
  mode: DeviceMode;
  orientation: Orientation;
  showFrame: boolean;
  url: string;
  reloadKey: number;
  background: CanvasBackground;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onOpenLibrary: () => void;
}

export function PreviewCanvas({
  devices,
  mode,
  orientation,
  showFrame,
  url,
  reloadKey,
  background,
  zoom,
  onZoomChange,
  onOpenLibrary,
}: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const light = isLightBackground(background);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setViewport({ width: rect.width, height: rect.height });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const measurements = devices.map((device) => ({
    device,
    body: getBodySize(device, mode, orientation, showFrame),
  }));

  const totalWidth =
    measurements.reduce((sum, item) => sum + item.body.width, 0) +
    DEVICE_GAP * Math.max(0, measurements.length - 1);
  const maxHeight = measurements.reduce(
    (max, item) => Math.max(max, item.body.height),
    0,
  );

  const ready = viewport.width > 0 && devices.length > 0;
  const fitScale = ready
    ? Math.min(
        Math.max(viewport.width - 100, 140) / Math.max(totalWidth, 1),
        Math.max(viewport.height - 172, 140) / Math.max(maxHeight + 44, 1),
        1,
      )
    : 1;
  const scale = clamp(fitScale * zoom, 0.06, 3);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", canvasBackgroundClass(background))}
    >
      {url ? (
        <div className="pointer-events-none absolute left-4 top-4 z-20 hidden max-w-[300px] items-start gap-2 rounded-lg border border-line bg-panel/95 px-3 py-2 text-xs leading-relaxed text-pretty text-muted shadow-lg backdrop-blur-md md:flex">
          <Info className="mt-0.5 size-3.5 shrink-0 text-muted" />
          <span>
            Blank screen? Some sites block iframes with{" "}
            <span className="font-mono text-zinc-400">X-Frame-Options</span>.
            Local dev servers work best.
          </span>
        </div>
      ) : null}

      <div className="absolute right-4 top-4 z-20 flex items-center gap-0.5 rounded-xl border border-line bg-panel/95 p-1 shadow-lg shadow-black/30 backdrop-blur-md">
        <button
          type="button"
          onClick={() => onZoomChange(clamp(zoom - 0.15, 0.4, 2.5))}
          title="Zoom out"
          aria-label="Zoom out"
          className="grid size-7 place-items-center rounded-lg text-muted transition-colors duration-150 ease-snappy hover:bg-elevated hover:text-zinc-200"
        >
          <Minus className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onZoomChange(1)}
          title="Fit to screen"
          aria-label="Fit to screen"
          className="flex h-7 min-w-[52px] items-center justify-center gap-1 rounded-lg px-1 font-mono text-[11px] text-zinc-400 transition-colors duration-150 ease-snappy hover:bg-elevated hover:text-white"
        >
          <ScanLine className="size-3" />
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          onClick={() => onZoomChange(clamp(zoom + 0.15, 0.4, 2.5))}
          title="Zoom in"
          aria-label="Zoom in"
          className="grid size-7 place-items-center rounded-lg text-muted transition-colors duration-150 ease-snappy hover:bg-elevated hover:text-zinc-200"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 pb-24 text-center">
          <span className="grid size-14 place-items-center rounded-2xl border border-line bg-panel text-accent shadow-xl">
            <Layers className="size-6" />
          </span>
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                light ? "text-zinc-800" : "text-zinc-200",
              )}
            >
              Pick a device to start previewing
            </p>
            <p
              className={cn(
                "mt-1 max-w-sm text-xs leading-relaxed text-pretty",
                light ? "text-zinc-600" : "text-muted",
              )}
            >
              Choose up to {MAX_DEVICES} devices and compare the same URL across
              foldables, flips, dual screens and more.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLibrary}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-[#0b0f04] transition-[background-color,transform] duration-150 ease-snappy hover:bg-accent-strong motion-safe:active:scale-[0.96] lg:hidden"
          >
            Open device library
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-6 pb-28 pt-16">
          <div
            className={cn(
              "flex items-center justify-center transition-opacity duration-300 motion-reduce:transition-none",
              ready ? "opacity-100" : "opacity-0",
            )}
            style={{ gap: DEVICE_GAP * scale }}
          >
            {measurements.map(({ device, body }) => {
              const resolved = resolveMode(device, mode);
              const dual = Boolean(
                device.screens.folded && device.screens.unfolded,
              );
              const modeLabel = dual
                ? resolved === "folded"
                  ? "Folded"
                  : "Unfolded"
                : body.screen.label;

              return (
                <div
                  key={device.id}
                  className="flex shrink-0 flex-col items-center gap-2.5"
                >
                  <DevicePreview
                    device={device}
                    mode={mode}
                    orientation={orientation}
                    showFrame={showFrame}
                    scale={scale}
                    url={url}
                    reloadKey={reloadKey}
                  />
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-xs font-medium",
                        light ? "text-zinc-700" : "text-zinc-300",
                      )}
                    >
                      {device.name}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 font-mono text-[10.5px]",
                        light ? "text-zinc-600" : "text-muted",
                      )}
                    >
                      {body.screen.width} × {body.screen.height} · {modeLabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
