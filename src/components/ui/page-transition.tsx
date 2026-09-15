import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * PageTransition — realistic notebook page-turning effect.
 *
 * When the route changes, the OLD page "flips" like a real sheet of paper
 * (left-to-right, curling with shadow) while the NEW page is revealed underneath.
 *
 * Desktop: full 3D page-flip with curl shadow and paper back.
 * Mobile: lighter horizontal flip (no heavy 3D for performance).
 * Respects prefers-reduced-motion.
 */

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const prevPathRef = useRef(location.pathname);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Snapshot of the old page to animate it flipping away
  const [oldSnapshot, setOldSnapshot] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Capture snapshot and trigger flip on route change
  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;

    if (reducedMotion) return;

    // Capture the current content as an image snapshot for the flip
    const el = contentRef.current;
    if (el) {
      // Use a simple approach: clone the visual state via background color
      // The "old page" will be a solid colored overlay that flips away
      setOldSnapshot("flip");
      setIsFlipping(true);

      // Clear any existing timer
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);

      // End the flip after animation completes
      flipTimerRef.current = setTimeout(
        () => {
          setIsFlipping(false);
          setOldSnapshot(null);
        },
        isMobile ? 1200 : 1500,
      );
    }

    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, [location.pathname, reducedMotion, isMobile]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        perspective: isMobile ? "800px" : "1500px",
        perspectiveOrigin: "left center",
        overflow: "hidden",
      }}
    >
      {/* The flipping "old page" overlay */}
      {isFlipping && oldSnapshot && (
        <>
          {/* Page flip sheet */}
          <div
            className={
              isMobile ? "page-flip-sheet-mobile" : "page-flip-sheet"
            }
            aria-hidden
          >
            {/* Paper back side (what you see as it turns) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, color-mix(in srgb, var(--background) 95%, #000) 0%, var(--background) 100%)",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: "0 4px 4px 0",
                boxShadow: "inset 10px 0 20px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
                {/* Subtle paper texture/lines on the back */}
                <div style={{ width: "100%", height: "100%", background: "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.03) 28px)" }} />
            </div>
            
            {/* Paper front side (fades out fast, just covers the new content initially) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--background)",
                backfaceVisibility: "hidden",
                borderRadius: "0 4px 4px 0",
              }}
            />
          </div>

          {/* Shadow that follows the fold crease */}
          <div
            className={
              isMobile
                ? "page-flip-shadow-mobile"
                : "page-flip-shadow"
            }
            aria-hidden
          />

          {/* Darkening on the revealed page (like a shadow from the flipping page) */}
          <div
            className={
              isMobile
                ? "page-flip-darken-mobile"
                : "page-flip-darken"
            }
            aria-hidden
          />
        </>
      )}

      {/* Actual page content */}
      <div ref={contentRef} style={{ position: "relative", zIndex: 0 }}>
        {children}
      </div>
    </div>
  );
}

export default PageTransition;
