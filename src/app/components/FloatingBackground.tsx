import React from "react";

interface ShapeItem {
  id: number;
  type: "sparkle" | "circle" | "polygon";
  size: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  opacity: number;
}

const BACKGROUND_SHAPES: ShapeItem[] = [
  { id: 1, type: "sparkle", size: 18, left: "6%", top: "8%", delay: "0s", duration: "25s", opacity: 0.16 },
  { id: 2, type: "circle", size: 28, left: "84%", top: "12%", delay: "2s", duration: "32s", opacity: 0.12 },
  { id: 3, type: "polygon", size: 36, left: "78%", top: "22%", delay: "4s", duration: "40s", opacity: 0.08 },
  { id: 4, type: "sparkle", size: 22, left: "14%", top: "35%", delay: "1s", duration: "28s", opacity: 0.18 },
  { id: 5, type: "circle", size: 16, left: "90%", top: "42%", delay: "5s", duration: "22s", opacity: 0.2 },
  { id: 6, type: "polygon", size: 32, left: "5%", top: "55%", delay: "3s", duration: "30s", opacity: 0.1 },
  { id: 7, type: "sparkle", size: 26, left: "86%", top: "68%", delay: "6s", duration: "36s", opacity: 0.12 },
  { id: 8, type: "circle", size: 18, left: "18%", top: "78%", delay: "0s", duration: "27s", opacity: 0.15 },
  { id: 9, type: "polygon", size: 40, left: "48%", top: "88%", delay: "7s", duration: "45s", opacity: 0.07 },
  { id: 10, type: "sparkle", size: 20, left: "64%", top: "52%", delay: "2s", duration: "29s", opacity: 0.14 },
  { id: 11, type: "circle", size: 24, left: "28%", top: "28%", delay: "3s", duration: "34s", opacity: 0.12 },
  { id: 12, type: "sparkle", size: 24, left: "82%", top: "48%", delay: "4s", duration: "31s", opacity: 0.15 },
  { id: 13, type: "polygon", size: 28, left: "12%", top: "62%", delay: "5s", duration: "38s", opacity: 0.09 },
  { id: 14, type: "circle", size: 16, left: "72%", top: "82%", delay: "1s", duration: "24s", opacity: 0.18 },
  { id: 15, type: "sparkle", size: 28, left: "52%", top: "18%", delay: "6s", duration: "42s", opacity: 0.11 }
];

export default function FloatingBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <style>{`
        @keyframes float-bg-drift {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-35px) translateX(20px) rotate(180deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(360deg);
          }
        }
        @keyframes float-bg-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: var(--base-op);
          }
          50% {
            transform: scale(1.12);
            opacity: calc(var(--base-op) * 1.4);
          }
        }
        .bg-floating-shape {
          position: absolute;
          animation: float-bg-drift linear infinite, float-bg-pulse ease-in-out infinite alternate;
        }
      `}</style>
      {BACKGROUND_SHAPES.map((shape) => {
        const style: React.CSSProperties = {
          left: shape.left,
          top: shape.top,
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          animationDelay: `${shape.delay}, ${shape.delay}`,
          animationDuration: `${shape.duration}, 8s`,
          "--base-op": shape.opacity,
          opacity: shape.opacity,
        } as React.CSSProperties;

        if (shape.type === "sparkle") {
          return (
            <svg
              key={shape.id}
              className="bg-floating-shape text-pink-500/20 fill-current"
              viewBox="0 0 24 24"
              style={style}
            >
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
            </svg>
          );
        } else if (shape.type === "circle") {
          return (
            <div
              key={shape.id}
              className="bg-floating-shape rounded-full bg-gradient-to-tr from-pink-400/20 to-pink-600/20 shadow-sm"
              style={style}
            />
          );
        } else {
          // Polygon / Diamond/ Triangle shape
          return (
            <svg
              key={shape.id}
              className="bg-floating-shape text-pink-400/20 fill-current"
              viewBox="0 0 24 24"
              style={style}
            >
              <polygon points="12,2 22,22 2,22" />
            </svg>
          );
        }
      })}
    </div>
  );
}
