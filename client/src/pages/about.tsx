import { ArrowRight, Briefcase, Github, FileText, Mail } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RevealFx } from "@/components/reveal-fx";
import { Sparkles, Target, Loader2 } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Editable } from "@/components/editable";
import { ProjectCard } from "@/components/project-card";
import type { PersonalInfo, AboutInfo, Project } from "@/lib/types";

export default function AboutPage() {
  const { data: personalInfo, isLoading: piLoading } = useContent<PersonalInfo>("/api/content/personal-info");
  const { data: aboutInfo, isLoading: aiLoading } = useContent<AboutInfo>("/api/content/about");
  const { data: projectsData } = useContent<Project[]>("/api/content/projects");
  const featuredProjects = (projectsData ?? []).filter((p) => p.featured).slice(0, 4);

  if (piLoading || aiLoading || !personalInfo || !aboutInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative min-h-[70vh] flex items-center justify-center pt-16">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <div className="space-y-6">
              <RevealFx delay={0} translateY={20} speed="fast">
              <Editable
                value={personalInfo.name}
                table="personal_info"
                id="main"
                field="name"
                as="h1"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                data-testid="text-hero-name"
              />
              </RevealFx>
              <RevealFx delay={0.1} translateY={24} speed="fast">
              <Editable
                value={personalInfo.tagline}
                table="personal_info"
                id="main"
                field="tagline"
                as="p"
                className="text-xl sm:text-2xl text-muted-foreground font-medium"
                data-testid="text-hero-tagline"
              />
              </RevealFx>
              <RevealFx delay={0.2} translateY={28} speed="fast">
              <Editable
                value={personalInfo.intro}
                table="personal_info"
                id="main"
                field="intro"
                as="p"
                className="max-w-2xl mx-auto text-lg leading-relaxed text-muted-foreground"
                data-testid="text-hero-intro"
              />
              </RevealFx>
            </div>

            <RevealFx delay={0.3} translateY={20} speed="fast">
            <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
              <Button size="lg" asChild data-testid="button-view-projects">
                <a href="#projects">
                  See My Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-view-experience">
                <Link href="/experience">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Experience
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-github">
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-resume">
                <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            </div>
            </RevealFx>

            <RevealFx delay={0.4} translateY={16} speed="fast">
            <div className="flex justify-center gap-4 mt-8">
              <Button size="icon" variant="ghost" asChild aria-label="LinkedIn" data-testid="button-linkedin">
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <SiLinkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild aria-label="Email" data-testid="button-email">
                <a href={`mailto:${personalInfo.email}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
            </RevealFx>
          </div>
        </section>

        {featuredProjects.length > 0 && (
          <RevealFx delay={0.3} translateY={32}>
          <section id="projects" className="py-16 md:py-24 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-featured-heading">
                  Featured Projects
                </h2>
                <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
                  All projects
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
          </RevealFx>
        )}

        <RevealFx delay={0.2} translateY={32}>
        <section id="about" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12" data-testid="text-about-heading">
              About Me
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <Editable
                  value={aboutInfo.bio}
                  table="about_info"
                  id="main"
                  field="bio"
                  as="p"
                  className="text-lg text-muted-foreground leading-relaxed"
                  data-testid="text-about-bio"
                />
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                  <Editable
                    value={aboutInfo.currentFocus}
                    table="about_info"
                    id="main"
                    field="currentFocus"
                    as="p"
                    className="text-muted-foreground"
                    data-testid="text-about-focus"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {aboutInfo.interests.map((interest: string) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              data-testid={`badge-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        </RevealFx>

        </main>
        <Footer />
      </div>
  );
}
