import { useState, useEffect, useRef, type ReactNode } from "react";

interface RevealFxProps {
  children: ReactNode;
  speed?: "fast" | "medium" | "slow" | number;
  delay?: number;
  translateY?: number;
  className?: string;
}

const speedMap = { fast: 1, medium: 2, slow: 3 };

export function RevealFx({
  children,
  speed = "medium",
  delay = 0,
  translateY = 16,
  className = "",
}: RevealFxProps) {
  const [isRevealed, setRevealed] = useState(false);
  const [maskRemoved, setMaskRemoved] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = typeof speed === "number" ? speed : speedMap[speed];

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setRevealed(true);
      timeoutRef.current = setTimeout(() => {
        setMaskRemoved(true);
      }, duration * 1000);
    }, delay * 1000);

    return () => {
      clearTimeout(delayTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay, duration]);

  const baseStyle: React.CSSProperties = {
    transitionDuration: `${duration}s`,
    transitionTimingFunction: "ease-in-out",
    transform: isRevealed ? "translateY(0)" : `translateY(${translateY}px)`,
  };

  if (maskRemoved) {
    return (
      <div className={className} style={{ ...baseStyle, filter: "blur(0)", opacity: 1 }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        transitionProperty: "all",
        maskImage: "linear-gradient(90deg, black 0, black 25%, transparent 50%)",
        WebkitMaskImage: "linear-gradient(90deg, black 0, black 25%, transparent 50%)",
        maskSize: "400% 100%",
        WebkitMaskSize: "400% 100%",
        maskPosition: isRevealed ? "0 0" : "100% 0",
        WebkitMaskPosition: isRevealed ? "0 0" : "100% 0",
        filter: isRevealed ? "blur(0)" : "blur(12px)",
        opacity: isRevealed ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
