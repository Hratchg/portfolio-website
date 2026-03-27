import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Home, Briefcase, FolderOpen } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { useContent } from "@/lib/use-content";
import type { NavLink } from "@/lib/types";

const iconMap: Record<string, typeof Home> = {
  user: Home,
  briefcase: Briefcase,
  folder: FolderOpen,
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { data: navLinksData } = useContent<NavLink[]>("/api/content/nav-links");
  const currentNavLinks = navLinksData ?? [];
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center pt-4 px-4">
      {/* Live clock — top right */}
      <span className="hidden sm:block fixed top-5 right-6 text-sm font-mono text-muted-foreground z-50" data-testid="text-live-time">
        {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>

      {/* Centered pill navbar */}
      <nav className="hidden md:flex items-center gap-1 bg-background/80 backdrop-blur-xl border border-border rounded-full px-2 py-1.5 shadow-lg">
        {currentNavLinks.map((link) => {
          const IconComponent = iconMap[link.icon];
          const isActive = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {link.label}
            </Link>
          );
        })}

        <div className="w-px h-5 bg-border mx-1" />

        <button
          className="flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      </nav>

      {/* Mobile navbar */}
      <div className="md:hidden flex items-center justify-between w-full">
        <nav className="flex items-center gap-1 bg-background/80 backdrop-blur-xl border border-border rounded-full px-2 py-1.5 shadow-lg flex-1 justify-center">
          {currentNavLinks.map((link) => {
            const IconComponent = iconMap[link.icon];
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs transition-all duration-200 ${
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            );
          })}

          <div className="w-px h-4 bg-border mx-0.5" />

          <button
            className="flex items-center justify-center h-7 w-7 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
