"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "./logo";

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export const REPO_URL =
  process.env.NEXT_PUBLIC_REPO_URL ??
  "https://github.com/letyassine/foldframe";

export function Header({
  libraryOpen,
  onOpenLibrary,
  inert,
}: {
  libraryOpen: boolean;
  onOpenLibrary: () => void;
  inert?: boolean;
}) {
  return (
    <header
      inert={inert || undefined}
      className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-line/80 bg-canvas/90 px-3 backdrop-blur-xl sm:px-4"
    >
      <button
        type="button"
        id="open-library"
        onClick={onOpenLibrary}
        aria-label="Open device library"
        aria-expanded={libraryOpen}
        aria-controls="device-library"
        className="grid size-8 place-items-center rounded-lg border border-line bg-panel text-zinc-400 transition-colors duration-150 ease-snappy hover:text-white lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <Link href="/" className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg border border-line bg-elevated text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Logo />
        </span>
        <span className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold tracking-tight text-white">
            foldframe
          </span>
          <span className="hidden rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:inline">
            beta
          </span>
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-xs text-muted md:inline">
          Open source · MIT
        </span>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View foldframe on GitHub"
          className="group flex h-8 items-center gap-2 rounded-lg border border-line bg-panel px-2.5 text-xs font-medium text-zinc-400 transition-colors duration-150 ease-snappy hover:border-line-strong hover:bg-elevated hover:text-white"
        >
          <GitHubMark className="size-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
