import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { SubSegment } from "../types";
import { THEME, KEYWORDS, FONT } from "../config";

interface Props {
  segments: SubSegment[];
  seed?: number;
}

const cleanWord = (w: string) => w.replace(/[^\w]/g, "").toLowerCase();

export const Subtitles: React.FC<Props> = ({ segments, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeIndex = segments.findIndex(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  );
  if (activeIndex === -1) return null;

  const active = segments[activeIndex];
  const isHook = activeIndex === 0;
  const localFrame = frame - active.startFrame;
  const totalDur = Math.max(1, active.endFrame - active.startFrame);

  // Animasi masuk kontainer subtitle (spring pop)
  const panelScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, stiffness: 150 },
  });

  // Animasi fade-out di akhir segmen
  const panelOpacity = interpolate(
    localFrame,
    [totalDur - 6, totalDur],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Progress kata per kata
  const wordProgress = interpolate(
    localFrame,
    [0, totalDur * 0.9],
    [0, active.words.length],
    { extrapolateRight: "clamp" }
  );

  const activeWordIdx = Math.min(
    active.words.length - 1,
    Math.floor(wordProgress)
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: panelOpacity,
        transform: `scale(${panelScale})`,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Hook Badge di segmen awal (detik 0-3) */}
      {isHook && (
        <div
          style={{
            marginBottom: 12,
            background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.primary})`,
            padding: "4px 18px",
            borderRadius: 20,
            color: "#000",
            fontSize: 16,
            fontWeight: 900,
            fontFamily: FONT.heading,
            letterSpacing: 1.5,
            boxShadow: `0 3px 14px ${THEME.accent}80`,
            transform: `scale(${spring({ frame: localFrame, fps, config: { damping: 10 } })})`,
          }}
        >
          {active.keyword ? `🔥 ${active.keyword.toUpperCase()}` : "🔥 WAJIB TAHU!"}
        </div>
      )}

      {/* Kontainer Kapsul Kaca Subtitle */}
      <div
        style={{
          background: THEME.glass,
          backdropFilter: `blur(${THEME.glassBlur}px)`,
          WebkitBackdropFilter: `blur(${THEME.glassBlur}px)`,
          border: `1.5px solid ${THEME.glassBorder}`,
          borderRadius: 20,
          padding: "16px 26px",
          maxWidth: "88%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 10px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.55)",
        }}
      >
        {active.words.map((word, i) => {
          const isSpoken = i <= activeWordIdx;
          const isCurrentlySpeaking = i === activeWordIdx;
          const cleaned = cleanWord(word);
          const isKeyword = Object.keys(KEYWORDS).includes(cleaned);

          // Pewarnaan kata
          let color = "rgba(255, 255, 255, 0.65)";
          if (isKeyword) {
            color = KEYWORDS[cleaned];
          } else if (isSpoken) {
            color = isCurrentlySpeaking ? THEME.primary : "#FFFFFF";
          }

          // Efek hentakan kata yang sedang dibaca (Word Pop)
          let wordScale = 1;
          if (isCurrentlySpeaking) {
            const wordF = Math.max(
              0,
              localFrame - (i / active.words.length) * totalDur * 0.9
            );
            const wSpring = spring({
              frame: wordF,
              fps,
              config: { damping: 8, stiffness: 220 },
            });
            wordScale = interpolate(wSpring, [0, 1], [0.92, 1.15]);
          }

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: isHook ? 32 : 28,
                fontWeight: isKeyword || isCurrentlySpeaking ? 900 : 700,
                fontFamily: FONT.heading,
                color,
                transform: `scale(${wordScale})`,
                textShadow: isSpoken
                  ? "0 2px 8px rgba(0,0,0,0.95), 0 0 2px #000"
                  : "0 1px 4px rgba(0,0,0,0.7)",
                filter: isKeyword && isSpoken ? `drop-shadow(0 0 8px ${color}A0)` : undefined,
                transition: "color 0.08s ease, transform 0.08s ease",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
