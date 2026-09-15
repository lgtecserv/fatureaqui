import { useRef, useCallback, useEffect, useState, type ReactNode } from "react";

/**
 * PeelSidebar — CSS 3D "peel" effect for the desktop sidebar.
 *
 * When the cursor approaches the right edge of the sidebar, the whole sidebar
 * lifts and curls away from the right side (rotateY around left origin),
 * revealing a branded gradient underneath.
 *
 * Behaviour:
 *  - Only on desktop (caller should gate on isMobile).
 *  - Only triggered by pointer interaction — no idle animation.
 *  - Respects prefers-reduced-motion.
 */

interface PeelSidebarProps {
  children: ReactNode;
  /** Width of the detection zone on the right edge, in px */
  zone?: number;
  /** Maximum rotation angle in degrees */
  maxAngle?: number;
  /** CSS perspective value */
  perspective?: number;
  /** Transition duration in seconds */
  duration?: number;
}

export function PeelSidebar({
  children,
  zone = 60,
  maxAngle = 14,
  perspective = 1200,
  duration = 0.6,
}: PeelSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reducedMotion) return;
      const container = containerRef.current;
      const sheet = sheetRef.current;
      const shadow = shadowRef.current;
      if (!container || !sheet) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const distFromRight = rect.width - x;

      if (distFromRight < zone && distFromRight >= 0) {
        // The closer to the right edge, the more peel
        const progress = 1 - distFromRight / zone;
        const angle = progress * maxAngle;
        const ease = progress * progress; // quadratic easing for natural feel

        sheet.style.transform = `rotateY(-${angle}deg)`;
        if (shadow) {
          shadow.style.opacity = `${ease * 0.35}`;
        }
      } else {
        sheet.style.transform = "rotateY(0deg)";
        if (shadow) {
          shadow.style.opacity = "0";
        }
      }
    },
    [zone, maxAngle, reducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    const sheet = sheetRef.current;
    const shadow = shadowRef.current;
    if (sheet) {
      sheet.style.transform = "rotateY(0deg)";
    }
    if (shadow) {
      shadow.style.opacity = "0";
    }
  }, []);

  const transitionValue = reducedMotion
    ? "none"
    : `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  const shadowTransition = reducedMotion
    ? "none"
    : `opacity ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: "left center",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Under layer — branded gradient revealed when sidebar peels */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `linear-gradient(135deg,
            color-mix(in srgb, var(--primary, #02664D) 6%, var(--sidebar, #fff)) 0%,
            color-mix(in srgb, var(--primary, #02664D) 14%, var(--sidebar, #fff)) 40%,
            color-mix(in srgb, var(--primary, #02664D) 8%, var(--sidebar, #fff)) 100%
          )`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary, #02664D) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, var(--primary, #02664D) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* The sidebar sheet that peels */}
      <div
        ref={sheetRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          transition: transitionValue,
          zIndex: 1,
          backfaceVisibility: "hidden",
        }}
      >
        {children}

        {/* Curl shadow — darkens the right edge when peeling */}
        <div
          ref={shadowRef}
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "40%",
            opacity: 0,
            background:
              "linear-gradient(to left, rgba(0,0,0,0.12) 0%, transparent 100%)",
            pointerEvents: "none",
            transition: shadowTransition,
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
}

export default PeelSidebar;
