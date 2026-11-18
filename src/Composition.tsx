import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ParallaxBackground } from "./components/ParallaxBackground";
import { FlashTransition } from "./components/FlashTransition";
import { Particles } from "./components/Particles";
import { Subtitles } from "./components/Subtitles";
import { CallToAction } from "./components/CallToAction";
import { ProgressBar } from "./components/ProgressBar";
import { parseSrt } from "./utils/parse-srt";
import { VIDEO, THEME, PALETTES } from "./config";
import type { MainProps } from "./types";

export type { MainProps };

export const MainComposition: React.FC<MainProps> = ({
  video,
  audio,
  audioMode,
  seed = 1,
  srtContent,
  showCta = false,
  ctaText = "🛒 CHECKOUT SEKARANG!",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Parse SRT dari props string (bebas akses sistem berkas)
  const segments = parseSrt(srtContent ?? "", fps);

  // Variasi warna tema per seed
  Object.assign(THEME, PALETTES[seed % PALETTES.length]);

  // Pengaturan audio & mute
  const videoMuted = audioMode === "mp3" || audioMode === "mute";
  const playMp3 = (audioMode === "mp3" || audioMode === "both") && !!audio;

  // Timing CTA (hanya aktif di 2.5 detik terakhir JIKA showCta diaktifkan)
  const ctaDuration = Math.round(fps * 2.5);
  const ctaEnterFrame = Math.max(0, durationInFrames - ctaDuration);
  const isCtaActive = showCta && frame >= ctaEnterFrame;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Layer 1: Video background dengan Parallax + Hook Zoom Punch + Beat Zoom + Screen Shake */}
      <ParallaxBackground
        src={staticFile(video)}
        muted={videoMuted}
        seed={seed}
        segments={segments}
      />

      {/* Layer 2: Kilatan transisi (Flash Cut) antar segmen */}
      <FlashTransition segments={segments} />

      {/* Layer 3: Partikel ambient mengambang */}
      <Particles seed={seed} />

      {/* Layer 4: Subtitle karaoke modern dengan word-pop (SATU layer, tidak double) */}
      {!isCtaActive && <Subtitles segments={segments} seed={seed} />}

      {/* Layer 5: Tombol Call To Action di akhir video (hanya jika showCta diaktifkan) */}
      {showCta && (
        <CallToAction
          text={ctaText}
          enterFrame={ctaEnterFrame}
          exitFrame={durationInFrames}
        />
      )}

      {/* Layer 6: Voiceover Audio */}
      {playMp3 && <Audio src={staticFile(audio)} volume={VIDEO.voVolume} />}

      {/* Layer 7: Progress bar durasi */}
      <ProgressBar />
    </AbsoluteFill>
  );
};
