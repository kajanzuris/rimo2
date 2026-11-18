import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { SubSegment } from "../types";
import { THEME, KEYWORDS, FONT } from "../config";

interface Props {
  segment?: SubSegment;
}

const cleanWord = (w: string) => w.replace(/[^\w]/g, "").toLowerCase();

export const HookHeadline: React.FC<Props> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!segment) return null;
  if (frame < segment.startFrame || frame > segment.endFrame) return null;

  const localFrame = frame - segment.startFrame;
  const totalDur = Math.max(1, segment.endFrame - segment.startFrame);

  // Animasi keluar di akhir hook
  const exitOpacity = interpolate(
    localFrame,
    [totalDur - 6, totalDur],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const exitScale = interpolate(
    localFrame,
    [totalDur - 6, totalDur],
    [1, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Perhitungan timing kemunculan kata per kata
  const words = segment.words;
  const wordProgress = interpolate(
    localFrame,
    [0, totalDur * 0.85],
    [0, words.length],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "22%",
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
        zIndex: 15,
        pointerEvents: "none",
        padding: "0 24px",
      }}
    >
      {words.map((word, i) => {
        // Kata hanya muncul saat gilirannya tiba
        const isShown = i <= wordProgress;
        if (!isShown) return null;

        const wordAppearFrame = Math.max(
          0,
          localFrame - (i / words.length) * totalDur * 0.85
        );
        const popSpring = spring({
          frame: wordAppearFrame,
          fps,
          config: { damping: 9, stiffness: 220 },
        });

        const cleaned = cleanWord(word);
        const isKeyword = Object.keys(KEYWORDS).includes(cleaned);

        // Desain balok stiker bergantian (Merah, Kuning, Putih) ala video referensi
        let bg = "transparent";
        let textColor = "#FFFFFF";
        let rotation = 0;
        let padding = "0 10px";

        if (i === 0) {
          // Kata pertama: teks putih raksasa dengan bayangan tebal
          bg = "transparent";
          textColor = "#FFFFFF";
          rotation = 0;
        } else if (isKeyword || i % 3 === 1) {
          // Kata penekanan / masalah: Balok Merah Neon miring
          bg = THEME.redSticker;
          textColor = "#FFFFFF";
          rotation = -2.5;
          padding = "6px 20px";
        } else if (i % 3 === 2) {
          // Balok Kuning tebal
          bg = THEME.yellowSticker;
          textColor = "#000000";
          rotation = 2;
          padding = "6px 20px";
        } else {
          // Balok Putih teks hitam
          bg = THEME.whiteSticker;
          textColor = "#000000";
          rotation = -1;
          padding = "6px 20px";
        }

        return (
          <div
            key={i}
            style={{
              display: "inline-block",
              background: bg,
              borderRadius: bg !== "transparent" ? 8 : 0,
              padding,
              transform: `scale(${popSpring}) rotate(${rotation}deg)`,
              boxShadow:
                bg !== "transparent"
                  ? "0 8px 24px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)"
                  : "none",
              border: bg !== "transparent" ? "3px solid #000000" : "none",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: FONT.heading,
                fontSize: 52,
                fontWeight: 900,
                color: textColor,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                lineHeight: 1.1,
                textAlign: "center",
                textShadow:
                  bg === "transparent"
                    ? "0 4px 12px rgba(0,0,0,0.9), 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                    : "none",
              }}
            >
              {word}
            </span>
          </div>
        );
      })}
    </div>
  );
};
