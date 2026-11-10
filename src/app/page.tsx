"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { UrlBar } from "@/components/url-bar";
import { DeviceSidebar } from "@/components/device-sidebar";
import { PreviewCanvas } from "@/components/preview-canvas";
import { ControlBar } from "@/components/control-bar";
import type { CanvasBackground } from "@/lib/canvas";
import {
  DEFAULT_DEVICE_ID,
  DEVICES,
  MAX_DEVICES,
  type CategoryFilter,
  type Device,
  type DeviceMode,
  type Orientation,
  getDevice,
  supportsMode,
} from "@/lib/devices";
import { normalizeUrl } from "@/lib/utils";

function hasFoldable(ids: string[]): boolean {
  return ids.some((id) => {
    const device = getDevice(id);
    return device ? supportsMode(device, "folded") : false;
  });
}

const STORAGE_KEY = "foldframe:state:v1";
const DEFAULT_URL = "https://example.com";

interface PersistedState {
  url: string;
  selectedIds: string[];
  mode: DeviceMode;
  orientation: Orientation;
  showFrame: boolean;
  background: CanvasBackground;
  zoom: number;
}

export default function Home() {
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    DEFAULT_DEVICE_ID,
  ]);
  const [mode, setMode] = useState<DeviceMode>("unfolded");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [showFrame, setShowFrame] = useState(true);
  const [background, setBackground] = useState<CanvasBackground>("grid");
  const [zoom, setZoom] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PersistedState>;

        if (typeof saved.url === "string") {
          const normalized = normalizeUrl(saved.url);
          if (normalized) {
            setUrl(normalized);
            setUrlInput(normalized);
          }
        }

        let nextIds: string[] = [DEFAULT_DEVICE_ID];

        if (Array.isArray(saved.selectedIds)) {
          nextIds = saved.selectedIds
            .filter(
              (id): id is string =>
                typeof id === "string" && Boolean(getDevice(id)),
            )
            .slice(0, MAX_DEVICES);
          setSelectedIds(nextIds);
        }

        if (saved.mode === "folded" || saved.mode === "unfolded") {
          setMode(
            saved.mode === "folded" && !hasFoldable(nextIds)
              ? "unfolded"
              : saved.mode,
          );
        }
        if (
          saved.orientation === "portrait" ||
          saved.orientation === "landscape"
        ) {
          setOrientation(saved.orientation);
        }
        if (typeof saved.showFrame === "boolean") {
          setShowFrame(saved.showFrame);
        }
        if (
          saved.background === "grid" ||
          saved.background === "midnight" ||
          saved.background === "plum" ||
          saved.background === "light"
        ) {
          setBackground(saved.background);
        }
        if (typeof saved.zoom === "number" && Number.isFinite(saved.zoom)) {
          setZoom(saved.zoom);
        }
      }
    } catch {
      // Ignore corrupt storage and start with defaults.
    } finally {
      setHydrated(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistedState = {
      url,
      selectedIds,
      mode,
      orientation,
      showFrame,
      background,
      zoom,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage can be unavailable in private mode.
    }
  }, [
    hydrated,
    url,
    selectedIds,
    mode,
    orientation,
    showFrame,
    background,
    zoom,
  ]);

  useEffect(() => {
    if (!libraryOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLibraryOpen(false);
        window.setTimeout(
          () => document.getElementById("open-library")?.focus(),
          0,
        );
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [libraryOpen]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input, textarea, select, [contenteditable='true']",
        )
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "/":
          event.preventDefault();
          document.getElementById("url-input")?.focus();
          break;
        case "r":
          setReloadKey((key) => key + 1);
          break;
        case "o":
          setOrientation((current) =>
            current === "portrait" ? "landscape" : "portrait",
          );
          break;
        case "f":
          setShowFrame((current) => !current);
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const selectedDevices = selectedIds
    .map((id) => getDevice(id))
    .filter((device): device is Device => Boolean(device));

  const canFold = selectedDevices.some((device) =>
    supportsMode(device, "folded"),
  );

  function closeLibrary() {
    setLibraryOpen(false);
    window.setTimeout(
      () => document.getElementById("open-library")?.focus(),
      0,
    );
  }

  function handleSubmit(value: string) {
    const normalized = normalizeUrl(value);
    if (!normalized) {
      setError("Enter a valid http(s) URL — for example localhost:3000");
      document.getElementById("url-input")?.focus();
      return;
    }

    setError(null);
    setUrlInput(normalized);
    if (normalized === url) {
      setReloadKey((key) => key + 1);
    } else {
      setUrl(normalized);
    }
  }

  function handleToggleDevice(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : selectedIds.length >= MAX_DEVICES
        ? selectedIds
        : [...selectedIds, id];

    if (next === selectedIds) return;

    setSelectedIds(next);
    if (mode === "folded" && !hasFoldable(next)) setMode("unfolded");
  }

  function handleModeChange(nextMode: DeviceMode) {
    if (nextMode === "folded" && !canFold) return;
    setMode(nextMode);
  }

  const query = search.trim().toLowerCase();
  const visibleDevices = DEVICES.filter((device) => {
    const matchesCategory =
      category === "all" || device.category === category;
    const matchesSearch =
      !query ||
      `${device.name} ${device.brand} ${device.category}`
        .toLowerCase()
        .includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas text-zinc-200">
      <Header
        libraryOpen={libraryOpen}
        onOpenLibrary={() => setLibraryOpen(true)}
        inert={libraryOpen}
      />

      <div
        inert={libraryOpen || undefined}
        className="shrink-0 border-b border-line/70 bg-canvas/80"
      >
        <UrlBar
          value={urlInput}
          onChange={(value) => {
            setUrlInput(value);
            if (error) setError(null);
          }}
          onSubmit={handleSubmit}
          onRefresh={() => setReloadKey((key) => key + 1)}
          onOpenExternal={() => {
            if (url) window.open(url, "_blank", "noopener,noreferrer");
          }}
          canOpen={Boolean(url)}
          error={error}
        />
      </div>

      <div className="relative flex min-h-0 flex-1">
        <DeviceSidebar
          devices={visibleDevices}
          selectedIds={selectedIds}
          search={search}
          category={category}
          open={libraryOpen}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onToggleDevice={handleToggleDevice}
          onClear={() => {
            setSelectedIds([]);
            setMode("unfolded");
          }}
          onClose={closeLibrary}
        />

        <main
          inert={libraryOpen || undefined}
          className="relative min-w-0 flex-1"
        >
          <PreviewCanvas
            devices={selectedDevices}
            mode={mode}
            orientation={orientation}
            showFrame={showFrame}
            url={url}
            reloadKey={reloadKey}
            background={background}
            zoom={zoom}
            onZoomChange={setZoom}
            onOpenLibrary={() => setLibraryOpen(true)}
          />
          <ControlBar
            mode={mode}
            canFold={canFold}
            orientation={orientation}
            showFrame={showFrame}
            background={background}
            onModeChange={handleModeChange}
            onOrientationChange={setOrientation}
            onToggleFrame={() => setShowFrame((current) => !current)}
            onBackgroundChange={setBackground}
          />
        </main>
      </div>
    </div>
  );
}
