import { useState, useMemo } from "react";
import { Search, ExternalLink, Github, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { projects, type Project } from "@shared/portfolio";

type CategoryFilter = "All" | "SWE" | "Data" | "ML";

const categories: CategoryFilter[] = ["All", "SWE", "Data", "ML"];

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Card
      className={`flex flex-col h-full transition-transform duration-200 hover:-translate-y-1 ${
        featured ? "md:col-span-2 lg:col-span-1" : ""
      }`}
      data-testid={`card-project-${project.id}`}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-md flex items-center justify-center">
        <span className="text-4xl font-bold text-primary/30">{project.title[0]}</span>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg" data-testid={`text-project-title-${project.id}`}>
            {project.title}
          </h3>
          {featured && (
            <Badge variant="secondary" className="flex-shrink-0">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <p
          className="text-sm text-muted-foreground"
          data-testid={`text-project-desc-${project.id}`}
        >
          {project.description}
        </p>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ul className="space-y-1">
          {project.highlights.map((highlight, idx) => (
            <li
              key={idx}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <span className="text-primary mt-1.5 flex-shrink-0">•</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="font-mono text-xs"
              data-testid={`badge-tech-${project.id}-${tech.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-0">
        {project.githubUrl && (
          <Button size="sm" variant="outline" asChild>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-github-${project.id}`}
            >
              <Github className="h-4 w-4 mr-1" />
              Code
            </a>
          </Button>
        )}
        {project.liveUrl && (
          <Button size="sm" asChild>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-live-${project.id}`}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Live Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        activeFilter === "All" || project.category === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-3xl md:text-4xl font-bold mb-8"
          data-testid="text-projects-heading"
        >
          Projects
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={activeFilter === category ? "default" : "outline"}
                onClick={() => setActiveFilter(category)}
                data-testid={`button-filter-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-projects"
            />
          </div>
        </div>

        {featuredProjects.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              Featured Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </>
        )}

        {regularProjects.length > 0 && (
          <>
            {featuredProjects.length > 0 && (
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                All Projects
              </h3>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {regularProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No projects found matching your criteria.
          </div>
        )}
      </div>
    </section>
  );
}
