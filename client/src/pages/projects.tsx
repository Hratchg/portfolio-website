import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RevealFx } from "@/components/reveal-fx";
import { Loader2 } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { EditableList } from "@/components/editable-list";
import { ProjectCard } from "@/components/project-card";
import { useEditMode } from "@/lib/edit-context";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const { data: projectsData, isLoading } = useContent<Project[]>("/api/content/projects");
  const { changes, addChange } = useEditMode();

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
                Things I've built and shipped. Live demos where available.
              </p>
            </RevealFx>

            <RevealFx delay={0.2} translateY={24}>
              <EditableList table="projects" onAdd={handleAddProject} addLabel="Add Project">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {allProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} dimmed={isDeleted(project.id)} />
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
