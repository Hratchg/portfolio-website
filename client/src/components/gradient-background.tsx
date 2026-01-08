import type { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: "default" | "subtle" | "vibrant";
}

export function GradientBackground({ children, variant = "default" }: GradientBackgroundProps) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        
        {variant === "default" && (
          <>
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-to-br from-primary/8 via-transparent to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-gradient-to-tl from-primary/5 via-transparent to-transparent blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-[30%] h-[30%] bg-gradient-to-bl from-accent/10 via-transparent to-transparent blur-3xl" />
          </>
        )}
        
        {variant === "subtle" && (
          <>
            <div className="absolute top-0 left-1/4 w-[40%] h-[40%] bg-gradient-to-br from-muted/50 via-transparent to-transparent blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-[35%] h-[35%] bg-gradient-to-tl from-muted/40 via-transparent to-transparent blur-3xl" />
          </>
        )}
        
        {variant === "vibrant" && (
          <>
            <div className="absolute top-0 left-0 w-[45%] h-[45%] bg-gradient-to-br from-primary/12 via-primary/4 to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-gradient-to-tl from-blue-500/8 via-transparent to-transparent dark:from-blue-400/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[30%] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 dark:from-purple-400/8 dark:via-pink-400/5 dark:to-orange-400/5 blur-3xl" />
          </>
        )}
        
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      {children}
    </div>
  );
}
