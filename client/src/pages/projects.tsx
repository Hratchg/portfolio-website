import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RevealFx } from "@/components/reveal-fx";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Loader2, Zap, Brain, Bot, GraduationCap, Map, Trophy } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Editable } from "@/components/editable";
import { EditableList, DeleteButton } from "@/components/editable-list";
import { EditableToggle } from "@/components/editable-select";
import { useEditMode } from "@/lib/edit-context";
import type { Project } from "@/lib/types";

const projectStyles: Record<string, { gradient: string; icon: typeof Zap }> = {
  skillshock: { gradient: "from-violet-500/30 via-fuchsia-500/20 to-pink-500/30", icon: Zap },
  swiftscreen: { gradient: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30", icon: Brain },
  "class-bot": { gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30", icon: Bot },
  "gaucho-course-optimizer": { gradient: "from-amber-500/30 via-orange-500/20 to-red-500/30", icon: GraduationCap },
  "league-of-classifications": { gradient: "from-red-500/30 via-rose-500/20 to-pink-500/30", icon: Trophy },
  "road-quality-mvp": { gradient: "from-sky-500/30 via-blue-500/20 to-indigo-500/30", icon: Map },
};

export default function ProjectsPage() {
  const { data: projectsData, isLoading } = useContent<Project[]>("/api/content/projects");
  const { changes, addChange, isEditMode } = useEditMode();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const allProjects = projectsData ?? [];

  const isDeleted = (id: string) =>
    changes.some((c) => c.type === "delete" && c.table === "projects" && c.id === id);

  const handleAddProject = () => {
    addChange({
      type: "create",
      table: "projects",
      data: { title: "New Project", description: "Description", highlights: [], techStack: [], category: "SWE", featured: false, githubUrl: null, liveUrl: null, sortOrder: allProjects.length },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <RevealFx delay={0} translateY={20}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-projects-heading">
                Personal Projects
              </h1>
              <p className="text-lg text-muted-foreground mb-12">
                Highlighted work from my portfolio.
              </p>
            </RevealFx>

            <RevealFx delay={0.2} translateY={24}>
              <EditableList table="projects" onAdd={handleAddProject} addLabel="Add Project">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {allProjects.map((project) => (
                    <Card
                      key={project.id}
                      className={`flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg relative group ${isDeleted(project.id) ? "opacity-50 pointer-events-none" : ""}`}
                      data-testid={`card-project-${project.id}`}
                    >
                      <DeleteButton table="projects" id={project.id} label="project" />
                      {(() => {
                        const style = projectStyles[project.id] || { gradient: "from-primary/20 to-accent/20", icon: Zap };
                        const Icon = style.icon;
                        return (
                          <div className={`aspect-video bg-gradient-to-br ${style.gradient} rounded-t-md flex flex-col items-center justify-center gap-3 relative overflow-hidden`}>
                            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                            <Icon className="h-10 w-10 text-foreground/25" />
                            <span className="text-sm font-semibold text-foreground/30 tracking-wide">
                              {project.title}
                            </span>
                          </div>
                        );
                      })()}
                      <CardContent className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Editable value={project.title} table="projects" id={project.id} field="title" as="h3" className="font-semibold text-lg" />
                          {project.featured && (
                            <Badge variant="secondary" className="flex-shrink-0">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <Editable value={project.description} table="projects" id={project.id} field="description" as="p" className="text-sm text-muted-foreground mb-4" />
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="outline" className="font-mono text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {project.category.split(",").map((cat: string) => (
                            <Badge key={cat} variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                              {cat.trim()}
                            </Badge>
                          ))}
                        </div>
                        <EditableToggle value={project.featured} table="projects" id={project.id} field="featured" label="Featured" />
                        <div className="flex gap-2 mt-2">
                          {project.githubUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-1" />
                                Code
                              </a>
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button size="sm" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Live
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </EditableList>
            </RevealFx>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
