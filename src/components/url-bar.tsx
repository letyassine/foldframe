"use client";

import { ArrowRight, ExternalLink, Globe, RotateCw } from "lucide-react";
import type { FormEvent } from "react";
import { cn } from "@/lib/utils";

const QUICK_URLS = [
  "localhost:3000",
  "localhost:5173",
  "localhost:8080",
  "example.com",
];

interface UrlBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onRefresh: () => void;
  onOpenExternal: () => void;
  canOpen: boolean;
  error: string | null;
}

export function UrlBar({
  value,
  onChange,
  onSubmit,
  onRefresh,
  onOpenExternal,
  canOpen,
  error,
}: UrlBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-3 py-2.5 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center gap-1.5 rounded-[14px] border bg-panel/80 p-1.5 pl-3 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_40px_-30px_rgba(0,0,0,0.9)] backdrop-blur transition-colors duration-150 ease-snappy",
          error
            ? "border-red-500/50 ring-2 ring-red-500/10"
            : "border-line focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10",
        )}
      >
        <Globe className="size-4 shrink-0 text-muted" />
        <label htmlFor="url-input" className="sr-only">
          URL to preview
        </label>
        <input
          id="url-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste a link or localhost:3000"
          inputMode="url"
          enterKeyHint="go"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "url-error" : undefined}
          className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-base text-zinc-100 placeholder:text-muted focus:outline-none sm:text-[12.5px]"
        />

        <button
          type="button"
          onClick={onRefresh}
          title="Reload preview (R)"
          aria-label="Reload preview"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 ease-snappy hover:bg-elevated hover:text-zinc-200"
        >
          <RotateCw className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onOpenExternal}
          disabled={!canOpen}
          title="Open in a new tab"
          aria-label="Open in a new tab"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 ease-snappy hover:bg-elevated hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-30"
        >
          <ExternalLink className="size-3.5" />
        </button>
        <button
          type="submit"
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-semibold text-[#0b0f04] transition-[background-color,transform] duration-150 ease-snappy hover:bg-accent-strong motion-safe:active:scale-[0.96]"
        >
          Preview
          <ArrowRight className="size-3.5" />
        </button>
      </form>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="shrink-0 text-[11px] text-muted">Try</span>
        {QUICK_URLS.map((quick) => (
          <button
            key={quick}
            type="button"
            onClick={() => {
              onChange(quick);
              onSubmit(quick);
            }}
            className="min-h-6 shrink-0 rounded-md border border-line bg-panel/60 px-2 font-mono text-[11px] text-muted transition-colors duration-150 ease-snappy hover:border-line-strong hover:text-zinc-200"
          >
            {quick}
          </button>
        ))}
        <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[11px] text-muted lg:flex">
          <span className="size-1.5 rounded-full bg-accent/80" />
          Direct iframe preview · no proxy ·{" "}
          <kbd className="rounded border border-line px-1 font-mono text-[10px] text-muted">
            /
          </kbd>{" "}
          to focus
        </span>
      </div>

      {error ? (
        <p id="url-error" role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
