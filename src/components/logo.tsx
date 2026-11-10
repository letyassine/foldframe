import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      <rect
        x="2.75"
        y="4"
        width="9.5"
        height="20"
        rx="2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <rect
        x="15.75"
        y="4"
        width="9.5"
        height="20"
        rx="2.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 3.25v21.5"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="20.5" cy="8.5" r="1.05" fill="var(--color-accent)" />
    </svg>
  );
}
