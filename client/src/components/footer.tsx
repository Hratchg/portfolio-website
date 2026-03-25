import { Github } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/use-content";
import type { PersonalInfo } from "@/lib/types";

export function Footer() {
  const { data: personalInfo } = useContent<PersonalInfo>("/api/content/personal-info");
  if (!personalInfo) return null;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-sm text-muted-foreground"
            data-testid="text-copyright"
          >
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              asChild
              aria-label="GitHub"
              data-testid="button-footer-github"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              asChild
              aria-label="LinkedIn"
              data-testid="button-footer-linkedin"
            >
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiLinkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
