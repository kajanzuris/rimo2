import type { VideoConfig } from "./types";

/** ========== KONFIGURASI VIDEO ========== */

export const VIDEO: VideoConfig = {
  fps: 30,
  width: 720,
  height: 1280,
  durationSec: 18,
  durationFrames: 540,
  bgmVolume: 0.15,
  voVolume: 1.0,
};

/** Warna tema default */
export const THEME = {
  primary: "#FFD700",       // kuning emas
  accent: "#FF4D6D",        // merah-pink
  text: "#FFFFFF",
  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
  glass: "rgba(0, 0, 0, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.2)",
  glassBlur: 14,
  progressBar: "#FFD700",
  progressBg: "rgba(255, 255, 255, 0.2)",
  particle: "#FFD700",
};

/** Palet warna dinamis per seed */
export const PALETTES = [
  { primary: "#FFD700", accent: "#FF4D6D", progressBar: "#FFD700", particle: "#FFD700" }, // Emas & Pink
  { primary: "#00E5FF", accent: "#FF2A6D", progressBar: "#00E5FF", particle: "#00E5FF" }, // Cyan Neon
  { primary: "#00FF88", accent: "#FFD700", progressBar: "#00FF88", particle: "#00FF88" }, // Mint Enerjik
  { primary: "#FF70A6", accent: "#FFD700", progressBar: "#FF70A6", particle: "#FF70A6" }, // Pink Pastel
  { primary: "#FF9F1C", accent: "#2EC4B6", progressBar: "#FF9F1C", particle: "#FF9F1C" }, // Sunset Orange
];

/** Kata kunci auto-highlight untuk berbagai kategori video */
export const KEYWORDS: Record<string, string> = {
  // Masalah / Attention Grabbers (Merah/Pink)
  mampet: "#FF4D6D",
  bau: "#FF4D6D",
  kotor: "#FF4D6D",
  rusak: "#FF4D6D",
  capek: "#FF4D6D",
  ribet: "#FF4D6D",
  mahal: "#FF4D6D",
  bahaya: "#FF4D6D",
  susah: "#FF4D6D",

  // Solusi & Keunggulan (Mint / Cyan / Gold)
  bersih: "#00FF88",
  hemat: "#00FF88",
  gratis: "#00FF88",
  praktis: "#00FF88",
  rapi: "#00FF88",
  mudah: "#00FF88",
  estetik: "#00E5FF",
  viral: "#00E5FF",
  rekomendasi: "#00E5FF",
  wajib: "#FFD700",
  keren: "#00E5FF",
  canggih: "#00E5FF",

  // Call-To-Action & Promo (Gold / Red)
  diskon: "#FFD700",
  promo: "#FFD700",
  checkout: "#FFD700",
  beli: "#FFD700",
  sekarang: "#FF4D6D",
  murah: "#FFD700",
  bonus: "#00FF88",
};

/** Tipografi */
export const FONT = {
  heading: "Inter, system-ui, -apple-system, sans-serif",
  body: "Inter, system-ui, -apple-system, sans-serif",
};
