"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { Check, RotateCcw, Search, X } from "lucide-react";
import {
  CATEGORIES,
  MAX_DEVICES,
  type CategoryFilter,
  type Device,
} from "@/lib/devices";
import { cn } from "@/lib/utils";

interface DeviceSidebarProps {
  devices: Device[];
  selectedIds: string[];
  search: string;
  category: CategoryFilter;
  open: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CategoryFilter) => void;
  onToggleDevice: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function DeviceGlyph({ device, active }: { device: Device; active: boolean }) {
  const tone = active
    ? "border-accent/60 bg-accent/10"
    : "border-line-strong bg-elevated";

  if (device.category === "foldable") {
    return (
      <span className="flex h-9 w-7 shrink-0 items-center justify-center gap-[2px]">
        <span className={cn("h-8 w-[10px] rounded-[3px] border", tone)} />
        <span className={cn("h-8 w-[10px] rounded-[3px] border", tone)} />
      </span>
    );
  }

  if (device.category === "dual-screen") {
    return (
      <span className="flex h-9 w-7 shrink-0 items-center justify-center gap-[2px]">
        <span className={cn("h-7 w-[10px] rounded-[2px] border", tone)} />
        <span className={cn("h-7 w-[10px] rounded-[2px] border", tone)} />
      </span>
    );
  }

  if (device.category === "flip") {
    return (
      <span className="flex h-9 w-7 shrink-0 items-center justify-center">
        <span className={cn("relative h-8 w-[15px] rounded-[4px] border", tone)}>
          <span className="absolute inset-x-[3px] top-[6px] h-px bg-white/10" />
        </span>
      </span>
    );
  }

  if (device.category === "tablet") {
    return (
      <span className="flex h-9 w-7 shrink-0 items-center justify-center">
        <span className={cn("h-8 w-6 rounded-[4px] border", tone)} />
      </span>
    );
  }

  return (
    <span className="flex h-9 w-7 shrink-0 items-center justify-center">
      <span className={cn("h-8 w-[15px] rounded-[4px] border", tone)}>
        <span className="mx-auto mt-[3px] block size-1 rounded-full bg-white/20" />
      </span>
    </span>
  );
}

export function DeviceSidebar({
  devices,
  selectedIds,
  search,
  category,
  open,
  onSearchChange,
  onCategoryChange,
  onToggleDevice,
  onClear,
  onClose,
}: DeviceSidebarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const atLimit = selectedIds.length >= MAX_DEVICES;
  const query = search.trim();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => searchRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Tab") return;

    const container = asideRef.current;
    if (!container) return;

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        ref={asideRef}
        id="device-library"
        data-open={open}
        onKeyDown={handleKeyDown}
        className={cn(
          "device-sidebar fixed inset-y-0 left-0 z-50 flex w-[312px] max-w-[86vw] flex-col border-r border-line bg-panel transition-transform duration-200 ease-snappy lg:static lg:z-0 lg:w-[306px] lg:max-w-none lg:translate-x-0 lg:bg-panel/30",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Device library"
      >
        <div className="flex items-start justify-between px-4 pb-3 pt-4">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Device library
            </h2>
            <p className="mt-1 text-xs text-muted">
              {selectedIds.length} of {MAX_DEVICES} selected
              {atLimit ? " · remove one to add another" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close device library"
            className="grid size-7 place-items-center rounded-lg text-muted transition-colors duration-150 ease-snappy hover:bg-elevated hover:text-white lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-3.5">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-canvas/60 px-2.5 py-1.5 transition-colors duration-150 ease-snappy focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10">
            <Search className="size-3.5 shrink-0 text-muted" />
            <input
              ref={searchRef}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search devices"
              aria-label="Search devices"
              className="min-h-6 min-w-0 flex-1 bg-transparent text-base text-zinc-200 placeholder:text-muted focus:outline-none sm:text-[12px]"
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="grid size-6 place-items-center rounded text-muted transition-colors duration-150 ease-snappy hover:text-zinc-200"
              >
                <X className="size-3" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1 px-3.5">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCategoryChange(item.id)}
              aria-pressed={category === item.id}
              className={cn(
                "min-h-6 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ease-snappy",
                category === item.id
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line bg-canvas/40 text-muted hover:border-line-strong hover:text-zinc-300",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="scroll-thin mt-2.5 flex-1 overflow-y-auto overscroll-contain px-2.5 pb-4">
          {devices.length === 0 ? (
            <div className="mt-10 px-4 text-center">
              <p className="text-[13px] text-zinc-300">
                {query ? `No devices match “${query}”` : "No devices found"}
              </p>
              <p className="mt-1 text-xs text-pretty text-muted">
                Try another name, or clear the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onCategoryChange("all");
                }}
                className="mt-3 min-h-7 rounded-lg border border-line bg-canvas/50 px-3 text-xs font-medium text-zinc-300 transition-colors duration-150 ease-snappy hover:border-line-strong hover:text-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {devices.map((device) => {
                const selected = selectedIds.includes(device.id);
                const disabled = !selected && atLimit;
                const screen =
                  device.screens.unfolded ?? device.screens.folded;

                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => onToggleDevice(device.id)}
                    aria-pressed={selected}
                    aria-disabled={disabled || undefined}
                    title={
                      disabled
                        ? `Remove a device to add more (max ${MAX_DEVICES})`
                        : undefined
                    }
                    className={cn(
                      "group flex w-full items-center gap-2.5 rounded-xl border px-2 py-1.5 text-left transition-colors duration-150 ease-snappy",
                      selected
                        ? "border-accent/25 bg-accent/[0.055]"
                        : "border-transparent hover:border-line hover:bg-elevated/60",
                      disabled && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <DeviceGlyph device={device} active={selected} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-medium text-zinc-200 transition-colors duration-150 group-hover:text-white">
                          {device.name}
                        </span>
                        {device.badge ? (
                          <span className="shrink-0 rounded border border-line bg-canvas/60 px-1 py-px text-[10px] font-medium uppercase tracking-wider text-muted">
                            {device.badge}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                        <span className="truncate">{device.brand}</span>
                        <span className="text-zinc-700">·</span>
                        <span>{device.year}</span>
                        {screen ? (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span className="font-mono text-muted">
                              {screen.width}×{screen.height}
                            </span>
                          </>
                        ) : null}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-150 ease-snappy",
                        selected
                          ? "border-accent bg-accent text-[#0b0f04]"
                          : "border-line-strong text-transparent",
                      )}
                    >
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-line/70 px-3.5 py-3">
          <button
            type="button"
            onClick={onClear}
            disabled={selectedIds.length === 0}
            className="flex min-h-8 w-full items-center justify-center gap-2 rounded-lg border border-line bg-canvas/50 py-1.5 text-xs font-medium text-zinc-400 transition-colors duration-150 ease-snappy hover:border-line-strong hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <RotateCcw className="size-3" />
            Clear selection
          </button>
          <p className="mt-2 px-1 text-[11px] leading-relaxed text-pretty text-muted">
            Viewport sizes are approximate CSS pixels. Add a device in{" "}
            <code className="rounded bg-canvas px-1 py-px font-mono text-[10.5px] text-muted">
              src/lib/devices.ts
            </code>
            .
          </p>
        </div>
      </aside>
    </>
  );
}
