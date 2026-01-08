import { ArrowDown, Github, FileText, Mail } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { personalInfo } from "@shared/portfolio";

export function HeroSection() {
  const scrollToProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="space-y-6">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            data-testid="text-hero-name"
          >
            {personalInfo.name}
          </h1>
          <p
            className="text-xl sm:text-2xl text-muted-foreground font-medium"
            data-testid="text-hero-tagline"
          >
            {personalInfo.tagline}
          </p>
          <p
            className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
            data-testid="text-hero-intro"
          >
            {personalInfo.intro}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <Button size="lg" onClick={scrollToProjects} data-testid="button-view-projects">
            View Projects
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            data-testid="button-github"
          >
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            data-testid="button-resume"
          >
            <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-4 w-4" />
              Resume
            </a>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={scrollToContact}
            data-testid="button-contact-hero"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            size="icon"
            variant="ghost"
            asChild
            aria-label="LinkedIn"
            data-testid="button-linkedin"
          >
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              <SiLinkedin className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
