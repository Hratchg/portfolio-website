import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Zap, Brain, Bot, GraduationCap, Map, Trophy } from "lucide-react";
import { Editable } from "@/components/editable";
import { DeleteButton } from "@/components/editable-list";
import { EditableToggle } from "@/components/editable-select";
import type { Project } from "@/lib/types";

const projectStyles: Record<string, { gradient: string; icon: typeof Zap }> = {
  skillshock: { gradient: "from-violet-500/30 via-fuchsia-500/20 to-pink-500/30", icon: Zap },
  swiftscreen: { gradient: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30", icon: Brain },
  "class-bot": { gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30", icon: Bot },
  "gaucho-course-optimizer": { gradient: "from-amber-500/30 via-orange-500/20 to-red-500/30", icon: GraduationCap },
  "league-of-classifications": { gradient: "from-red-500/30 via-rose-500/20 to-pink-500/30", icon: Trophy },
  "road-quality-mvp": { gradient: "from-sky-500/30 via-blue-500/20 to-indigo-500/30", icon: Map },
};

/**
 * Demo previews shown at the top of a card, keyed by project id.
 * Files live in client/public/demos/. A project without an entry falls back
 * to the gradient + icon placeholder.
 */
const projectMedia: Record<string, { video: string; poster: string }> = {
  "gaucho-course-optimizer": { video: "/demos/coursepick.mp4", poster: "/demos/coursepick.jpg" },
  "road-quality-mvp": { video: "/demos/road-quality.mp4", poster: "/demos/road-quality.jpg" },
};

/** Muted, looping preview that only plays while on screen. */
function DemoVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-top"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={`${title} demo`}
    />
  );
}

export function ProjectCard({ project, dimmed = false }: { project: Project; dimmed?: boolean }) {
  const style = projectStyles[project.id] || { gradient: "from-primary/20 to-accent/20", icon: Zap };
  const Icon = style.icon;
  const media = projectMedia[project.id];

  return (
    <Card
      className={`flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg relative group ${dimmed ? "opacity-50 pointer-events-none" : ""}`}
      data-testid={`card-project-${project.id}`}
    >
      <DeleteButton table="projects" id={project.id} label="project" />
      <div className={`aspect-video bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center gap-3 relative overflow-hidden`}>
        {media ? (
          <DemoVideo src={media.video} poster={media.poster} title={project.title} />
        ) : (
          <>
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "20px 20px" }} />
            <Icon className="h-10 w-10 text-foreground/25" />
            <span className="text-sm font-semibold text-foreground/30 tracking-wide">{project.title}</span>
          </>
        )}
      </div>
      <CardContent className="flex-1 flex flex-col p-6">
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
          {project.techStack.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="outline" className="font-mono text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <EditableToggle value={project.featured} table="projects" id={project.id} field="featured" label="Featured" />
        <div className="flex gap-2 mt-auto pt-2">
          {project.liveUrl && (
            <Button size="sm" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Live demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button size="sm" variant="outline" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" />
                Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
