import React from "react";
import { Video, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { SubSegment } from "../types";

interface Props {
  src: string;
  muted?: boolean;
  seed?: number;
  segments?: SubSegment[];
}

export const ParallaxBackground: React.FC<Props> = ({
  src,
  muted = true,
  seed = 1,
  segments = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Slow Cinematic Drift (zoom & pan perlahan)
  const strength = 1.05 + (seed % 5) * 0.015; // 1.05 - 1.12
  const zoomRange: [number, number] =
    seed % 2 === 0 ? [1.02, strength] : [strength, 1.02];

  const baseScale = interpolate(frame, [0, durationInFrames], zoomRange, {
    extrapolateRight: "clamp",
  });

  const panDir = seed % 2 === 0 ? 1 : -1;
  const baseTranslateY = interpolate(
    frame,
    [0, durationInFrames],
    [-2 * panDir, 2 * panDir],
    { extrapolateRight: "clamp" }
  );

  // 2. Hook Punch Zoom (Detik 0 - 1 / Frame 0 - 25)
  // Sentakan zoom awal untuk langsung menangkap perhatian penonton di detik pertama
  const hookSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const hookZoom = interpolate(hookSpring, [0, 1], [0.12, 0]);

  // 3. Segment Beat Zoom (Hentakan mikro +0.04 saat kalimat baru dimulai)
  let beatZoom = 0;
  for (const seg of segments) {
    if (seg.startFrame > 0 && frame >= seg.startFrame && frame < seg.startFrame + 16) {
      const beatSpring = spring({
        frame: frame - seg.startFrame,
        fps,
        config: { damping: 10, stiffness: 180 },
      });
      const pulse = interpolate(beatSpring, [0, 0.4, 1], [0, 0.045, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      beatZoom = Math.max(beatZoom, pulse);
    }
  }

  // 4. Keyword Screen Shake (Getaran / Tremor kamera saat kata kunci penting muncul)
  let shakeX = 0;
  let shakeY = 0;
  const activeSeg = segments.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  );

  if (activeSeg && activeSeg.keyword) {
    const localF = frame - activeSeg.startFrame;
    if (localF >= 0 && localF <= 14) {
      const damp = interpolate(localF, [0, 14], [1, 0], {
        extrapolateRight: "clamp",
      });
      shakeX = Math.sin(localF * 2.2) * 8 * damp;
      shakeY = Math.cos(localF * 1.8) * 6 * damp;
    }
  }

  const finalScale = baseScale + hookZoom + beatZoom;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Video
        src={src}
        muted={muted}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${finalScale}) translate(${shakeX}px, calc(${baseTranslateY}% + ${shakeY}px))`,
        }}
      />
      {/* Vignette Overlay untuk fokus ke subjek */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
