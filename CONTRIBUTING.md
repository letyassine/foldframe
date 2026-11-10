# Contributing to foldframe

Thanks for taking the time to contribute. This project is intentionally small and dependency-light, so it is easy to get involved.

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

Before opening a pull request:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Project structure

```
src/
  app/
    page.tsx          # app state and layout
    globals.css       # Tailwind v4 theme, canvas backgrounds, animations
  components/
    device-preview.tsx  # iframe + CSS device frame renderer
    device-sidebar.tsx  # searchable device library
    preview-canvas.tsx  # fit-to-screen scaling and device labels
    control-bar.tsx     # mode, orientation, frame, canvas controls
    url-bar.tsx         # URL input and quick presets
  lib/
    devices.ts        # device catalog and viewport helpers
    canvas.ts         # canvas background themes
    utils.ts          # URL normalization and small helpers
```

## Adding or updating a device

1. Edit `src/lib/devices.ts`.
2. Use **logical CSS viewport sizes**, not physical panel resolutions. When in doubt, check what a browser reports on the device (for example via remote debugging) or link a reputable source in your PR.
3. Add both `folded` and `unfolded` screens for book-style foldables and flips. Dual-screen devices use a single `unfolded` screen that spans the hinge.
4. Match the frame to the hardware: `bezel`, `screenRadius`, `camera`, and an optional `hinge` (`crease` for foldables/flips, `gap` for dual-screen devices).
5. Keep entries alphabetized by brand, then name.

## Frame rendering

The device body is pure CSS. If you change the renderer, keep these invariants:

- The iframe must keep the real logical viewport size; only the outer wrapper is scaled.
- Hinge and camera overlays must use `pointer-events-none` so the site stays interactive.
- Frames should remain readable at scales down to ~10% and at 3x zoom.

## Code style

- TypeScript strict mode, no `any`.
- Follow the existing component and naming patterns.
- Tailwind utility classes for styling; custom CSS only for things utilities cannot express.
- No new runtime dependencies unless they are clearly justified.
- Keep accessibility in mind: buttons need accessible names, icon-only controls need `aria-label` or `title`.

## Pull requests

- Keep changes focused. One feature or fix per PR.
- Describe the device(s) or behavior affected, and include a screenshot for visual changes.
- Make sure `pnpm lint`, `pnpm typecheck` and `pnpm build` pass.
- By contributing you agree that your work is licensed under the MIT license.

## Reporting issues

Please include:

- The URL or type of site you tried to preview (never share secrets).
- The device preset and mode.
- Browser and OS.
- A screenshot if the issue is visual.

For blocked iframes, include the site's `X-Frame-Options` / `Content-Security-Policy` headers if you can. Many "blank preview" reports are sites intentionally refusing to be embedded.
