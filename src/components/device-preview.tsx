"use client";

import { useEffect, useState } from "react";
import {
  type Device,
  type DeviceMode,
  type HingeSpec,
  type Orientation,
  getScreen,
  resolveMode,
} from "@/lib/devices";
import { Logo } from "./logo";

interface DevicePreviewProps {
  device: Device;
  mode: DeviceMode;
  orientation: Orientation;
  showFrame: boolean;
  scale: number;
  url: string;
  reloadKey: number;
}

function HingeOverlay({
  hinge,
  orientation,
}: {
  hinge: HingeSpec;
  orientation: Orientation;
}) {
  const axis =
    orientation === "landscape"
      ? hinge.axis === "vertical"
        ? "horizontal"
        : "vertical"
      : hinge.axis;

  if (hinge.type === "gap") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20"
        style={
          axis === "vertical"
            ? {
                top: 0,
                bottom: 0,
                left: "50%",
                width: hinge.size,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(90deg, #030407, #191d23 45%, #030407)",
                boxShadow: "0 0 22px rgba(0,0,0,0.7)",
              }
            : {
                left: 0,
                right: 0,
                top: "50%",
                height: hinge.size,
                transform: "translateY(-50%)",
                background:
                  "linear-gradient(180deg, #030407, #191d23 45%, #030407)",
                boxShadow: "0 0 22px rgba(0,0,0,0.7)",
              }
        }
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20"
      style={
        axis === "vertical"
          ? {
              top: 0,
              bottom: 0,
              left: "50%",
              width: hinge.size,
              transform: "translateX(-50%)",
              background:
                "linear-gradient(90deg, transparent, rgba(0,0,0,0.4) 35%, rgba(255,255,255,0.13) 50%, rgba(0,0,0,0.4) 65%, transparent)",
            }
          : {
              left: 0,
              right: 0,
              top: "50%",
              height: hinge.size,
              transform: "translateY(-50%)",
              background:
                "linear-gradient(180deg, transparent, rgba(0,0,0,0.4) 35%, rgba(255,255,255,0.13) 50%, rgba(0,0,0,0.4) 65%, transparent)",
            }
      }
    />
  );
}

function CameraOverlay({
  camera,
  orientation,
  screenWidth,
}: {
  camera: "island" | "punch";
  orientation: Orientation;
  screenWidth: number;
}) {
  const portrait = orientation === "portrait";

  if (camera === "island") {
    const long = Math.min(94, Math.round(screenWidth * 0.24));
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)]"
        style={
          portrait
            ? {
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: long,
                height: 25,
              }
            : {
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 25,
                height: long,
              }
        }
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 size-2.5 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
      style={
        portrait
          ? { top: 10, left: "50%", transform: "translateX(-50%)" }
          : { left: 10, top: "50%", transform: "translateY(-50%)" }
      }
    />
  );
}

export function DevicePreview({
  device,
  mode,
  orientation,
  showFrame,
  scale,
  url,
  reloadKey,
}: DevicePreviewProps) {
  const resolvedMode = resolveMode(device, mode);
  const screen = getScreen(device, resolvedMode, orientation);
  const bezel = showFrame ? device.frame.bezel : 0;
  const bodyWidth = screen.width + bezel * 2;
  const bodyHeight = screen.height + bezel * 2;
  const screenRadius = showFrame ? device.frame.screenRadius : 0;
  const bodyRadius = showFrame ? device.frame.screenRadius + bezel : 0;
  const hinge = resolvedMode === "unfolded" ? device.frame.hinge : undefined;
  const camera =
    showFrame && device.frame.camera !== "none"
      ? device.frame.camera
      : undefined;

  const loadKey = `${url}::${reloadKey}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loading = Boolean(url) && loadedKey !== loadKey;

  useEffect(() => {
    if (!url) return;
    const timer = window.setTimeout(() => setLoadedKey(loadKey), 8000);
    return () => window.clearTimeout(timer);
  }, [url, loadKey]);

  return (
    <div
      className="relative shrink-0"
      style={{ width: bodyWidth * scale, height: bodyHeight * scale }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: bodyWidth,
          height: bodyHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          className="relative"
          style={{
            width: bodyWidth,
            height: bodyHeight,
            padding: bezel,
            borderRadius: bodyRadius,
            background: showFrame
              ? "linear-gradient(148deg, #424952 0%, #1a1f25 28%, #090b0e 64%, #2e343c 100%)"
              : "transparent",
            boxShadow: showFrame
              ? "0 45px 90px -35px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.08)"
              : "0 35px 80px -35px rgba(0,0,0,0.85)",
          }}
        >
          <div
            className="relative overflow-hidden bg-black"
            style={{
              width: screen.width,
              height: screen.height,
              borderRadius: screenRadius,
              boxShadow: showFrame
                ? "inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 22px rgba(0,0,0,0.8)"
                : "none",
            }}
          >
            {url ? (
              <iframe
                key={`${url}-${reloadKey}`}
                src={url}
                title={`${device.name} preview of ${url}`}
                onLoad={() => setLoadedKey(loadKey)}
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-presentation"
                allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 bg-white"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 overflow-hidden bg-[radial-gradient(circle_at_50%_28%,#151a20,#07080a_72%)] px-4 text-center">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-accent">
                  <Logo className="size-4" />
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-zinc-300">
                    Nothing to preview yet
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-pretty text-muted">
                    Paste a link above or try localhost:3000
                  </span>
                </span>
              </div>
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.045] via-transparent to-transparent"
              style={{ borderRadius: screenRadius }}
            />

            {url && loading ? (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 overflow-hidden bg-white/10">
                <div className="loading-sweep relative h-full w-full" />
              </div>
            ) : null}

            {hinge ? (
              <HingeOverlay hinge={hinge} orientation={orientation} />
            ) : null}

            {camera ? (
              <CameraOverlay
                camera={camera}
                orientation={orientation}
                screenWidth={screen.width}
              />
            ) : null}
          </div>

          {showFrame ? (
            <div aria-hidden="true" className="pointer-events-none">
              <span className="absolute -right-[2px] top-[22%] h-9 w-[3px] rounded-r-[2px] bg-gradient-to-b from-zinc-500/80 to-zinc-700/50" />
              <span className="absolute -right-[2px] top-[34%] h-14 w-[3px] rounded-r-[2px] bg-gradient-to-b from-zinc-500/70 to-zinc-700/40" />
              <span className="absolute -left-[2px] top-[26%] h-12 w-[3px] rounded-l-[2px] bg-gradient-to-b from-zinc-500/70 to-zinc-700/40" />
              {device.category === "foldable" && resolvedMode === "folded" ? (
                <span className="absolute inset-y-[12%] left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
