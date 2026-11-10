export type DeviceMode = "folded" | "unfolded";
export type Orientation = "portrait" | "landscape";

export type DeviceCategory =
  | "foldable"
  | "flip"
  | "dual-screen"
  | "phone"
  | "tablet";

export interface ScreenSpec {
  label: string;
  width: number;
  height: number;
}

export interface HingeSpec {
  type: "crease" | "gap";
  axis: "vertical" | "horizontal";
  size: number;
}

export interface DeviceFrameSpec {
  bezel: number;
  screenRadius: number;
  camera: "island" | "punch" | "none";
  hinge?: HingeSpec;
}

export interface Device {
  id: string;
  name: string;
  brand: string;
  category: DeviceCategory;
  year: number;
  screens: Partial<Record<DeviceMode, ScreenSpec>>;
  frame: DeviceFrameSpec;
  badge?: string;
}

/**
 * Viewport sizes are approximate logical CSS pixels (the size a browser
 * reports to a website), not physical panel resolutions. They are close
 * enough for layout testing and easy to tweak — PRs with better data are
 * very welcome.
 */
export const DEVICES: Device[] = [
  {
    id: "galaxy-z-fold-6",
    name: "Galaxy Z Fold 6",
    brand: "Samsung",
    category: "foldable",
    year: 2024,
    badge: "Popular",
    screens: {
      folded: { label: "Cover screen", width: 344, height: 882 },
      unfolded: { label: "Main display", width: 674, height: 842 },
    },
    frame: {
      bezel: 9,
      screenRadius: 18,
      camera: "punch",
      hinge: { type: "crease", axis: "vertical", size: 3 },
    },
  },
  {
    id: "galaxy-z-fold-5",
    name: "Galaxy Z Fold 5",
    brand: "Samsung",
    category: "foldable",
    year: 2023,
    screens: {
      folded: { label: "Cover screen", width: 344, height: 882 },
      unfolded: { label: "Main display", width: 673, height: 841 },
    },
    frame: {
      bezel: 9,
      screenRadius: 18,
      camera: "punch",
      hinge: { type: "crease", axis: "vertical", size: 3 },
    },
  },
  {
    id: "pixel-fold",
    name: "Pixel Fold",
    brand: "Google",
    category: "foldable",
    year: 2023,
    screens: {
      folded: { label: "Cover screen", width: 411, height: 797 },
      unfolded: { label: "Main display", width: 701, height: 841 },
    },
    frame: {
      bezel: 10,
      screenRadius: 22,
      camera: "punch",
      hinge: { type: "crease", axis: "vertical", size: 3 },
    },
  },
  {
    id: "oneplus-open",
    name: "OnePlus Open",
    brand: "OnePlus",
    category: "foldable",
    year: 2023,
    screens: {
      folded: { label: "Cover screen", width: 350, height: 778 },
      unfolded: { label: "Main display", width: 704, height: 770 },
    },
    frame: {
      bezel: 8,
      screenRadius: 18,
      camera: "punch",
      hinge: { type: "crease", axis: "vertical", size: 3 },
    },
  },
  {
    id: "honor-magic-v2",
    name: "Magic V2",
    brand: "HONOR",
    category: "foldable",
    year: 2023,
    screens: {
      folded: { label: "Cover screen", width: 360, height: 840 },
      unfolded: { label: "Main display", width: 720, height: 800 },
    },
    frame: {
      bezel: 8,
      screenRadius: 16,
      camera: "punch",
      hinge: { type: "crease", axis: "vertical", size: 3 },
    },
  },
  {
    id: "mix-fold-3",
    name: "MIX Fold 3",
    brand: "Xiaomi",
    category: "foldable",
    year: 2023,
    screens: {
      folded: { label: "Cover screen", width: 360, height: 840 },
      unfolded: { label: "Main display", width: 720, height: 800 },
    },
    frame: {
      bezel: 8,
      screenRadius: 16,
      camera: "punch",
      hinge: { type: "crease", axis: "vertical", size: 3 },
    },
  },
  {
    id: "galaxy-z-flip-6",
    name: "Galaxy Z Flip 6",
    brand: "Samsung",
    category: "flip",
    year: 2024,
    badge: "Popular",
    screens: {
      folded: { label: "Cover screen", width: 360, height: 374 },
      unfolded: { label: "Main display", width: 360, height: 880 },
    },
    frame: {
      bezel: 8,
      screenRadius: 24,
      camera: "punch",
      hinge: { type: "crease", axis: "horizontal", size: 3 },
    },
  },
  {
    id: "razr-40-ultra",
    name: "Razr 40 Ultra",
    brand: "Motorola",
    category: "flip",
    year: 2023,
    screens: {
      folded: { label: "Cover screen", width: 352, height: 355 },
      unfolded: { label: "Main display", width: 360, height: 880 },
    },
    frame: {
      bezel: 8,
      screenRadius: 24,
      camera: "punch",
      hinge: { type: "crease", axis: "horizontal", size: 3 },
    },
  },
  {
    id: "pocket-2",
    name: "Pocket 2",
    brand: "Huawei",
    category: "flip",
    year: 2024,
    screens: {
      folded: { label: "Cover screen", width: 340, height: 340 },
      unfolded: { label: "Main display", width: 360, height: 880 },
    },
    frame: {
      bezel: 8,
      screenRadius: 24,
      camera: "punch",
      hinge: { type: "crease", axis: "horizontal", size: 3 },
    },
  },
  {
    id: "surface-duo-2",
    name: "Surface Duo 2",
    brand: "Microsoft",
    category: "dual-screen",
    year: 2021,
    badge: "Dual screen",
    screens: {
      unfolded: { label: "Spanning display", width: 908, height: 631 },
    },
    frame: {
      bezel: 9,
      screenRadius: 14,
      camera: "none",
      hinge: { type: "gap", axis: "vertical", size: 20 },
    },
  },
  {
    id: "lg-v60-dual-screen",
    name: "V60 Dual Screen",
    brand: "LG",
    category: "dual-screen",
    year: 2020,
    screens: {
      unfolded: { label: "Spanning display", width: 802, height: 895 },
    },
    frame: {
      bezel: 10,
      screenRadius: 16,
      camera: "none",
      hinge: { type: "gap", axis: "vertical", size: 16 },
    },
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "phone",
    year: 2023,
    badge: "Popular",
    screens: {
      unfolded: { label: "Display", width: 430, height: 932 },
    },
    frame: { bezel: 8, screenRadius: 30, camera: "island" },
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "phone",
    year: 2023,
    screens: {
      unfolded: { label: "Display", width: 393, height: 852 },
    },
    frame: { bezel: 8, screenRadius: 28, camera: "island" },
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    brand: "Google",
    category: "phone",
    year: 2023,
    screens: {
      unfolded: { label: "Display", width: 448, height: 998 },
    },
    frame: { bezel: 8, screenRadius: 26, camera: "punch" },
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "phone",
    year: 2024,
    screens: {
      unfolded: { label: "Display", width: 412, height: 915 },
    },
    frame: { bezel: 7, screenRadius: 16, camera: "punch" },
  },
  {
    id: "nothing-phone-2",
    name: "Phone (2)",
    brand: "Nothing",
    category: "phone",
    year: 2023,
    screens: {
      unfolded: { label: "Display", width: 360, height: 804 },
    },
    frame: { bezel: 8, screenRadius: 24, camera: "punch" },
  },
  {
    id: "ipad-mini",
    name: "iPad mini",
    brand: "Apple",
    category: "tablet",
    year: 2021,
    screens: {
      unfolded: { label: "Display", width: 744, height: 1133 },
    },
    frame: { bezel: 12, screenRadius: 16, camera: "none" },
  },
  {
    id: "ipad-pro-11",
    name: 'iPad Pro 11"',
    brand: "Apple",
    category: "tablet",
    year: 2022,
    screens: {
      unfolded: { label: "Display", width: 834, height: 1194 },
    },
    frame: { bezel: 12, screenRadius: 18, camera: "none" },
  },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "foldable", label: "Foldables" },
  { id: "flip", label: "Flips" },
  { id: "dual-screen", label: "Dual screen" },
  { id: "phone", label: "Phones" },
  { id: "tablet", label: "Tablets" },
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number]["id"];

export const DEFAULT_DEVICE_ID = "galaxy-z-fold-6";
export const MAX_DEVICES = 4;

export function getDevice(id: string): Device | undefined {
  return DEVICES.find((device) => device.id === id);
}

export function resolveMode(device: Device, mode: DeviceMode): DeviceMode {
  if (device.screens[mode]) return mode;
  if (device.screens.unfolded) return "unfolded";
  return "folded";
}

export function getScreen(
  device: Device,
  mode: DeviceMode,
  orientation: Orientation,
): ScreenSpec {
  const resolved = resolveMode(device, mode);
  const screen = device.screens[resolved] ?? device.screens.unfolded;
  if (!screen) {
    return { label: "Display", width: 360, height: 800 };
  }
  if (orientation === "landscape") {
    return { ...screen, width: screen.height, height: screen.width };
  }
  return screen;
}

export interface BodySize {
  width: number;
  height: number;
  screen: ScreenSpec;
  bezel: number;
}

export function getBodySize(
  device: Device,
  mode: DeviceMode,
  orientation: Orientation,
  showFrame: boolean,
): BodySize {
  const screen = getScreen(device, mode, orientation);
  const bezel = showFrame ? device.frame.bezel : 0;
  return {
    width: screen.width + bezel * 2,
    height: screen.height + bezel * 2,
    screen,
    bezel,
  };
}

export function supportsMode(device: Device, mode: DeviceMode): boolean {
  return Boolean(device.screens[mode]);
}

export function categoryLabel(category: DeviceCategory): string {
  return (
    CATEGORIES.find((item) => item.id === category)?.label ?? category
  );
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height}`;
}
