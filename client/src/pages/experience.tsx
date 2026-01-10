import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { experiences, aboutInfo, projects, skills, type Skill } from "@shared/portfolio";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star } from "lucide-react";

function SkillCategory({
  category,
  categorySkills,
}: {
  category: Skill["category"];
  categorySkills: Skill[];
}) {
  return (
    <div className="space-y-4">
      <h3
        className="font-semibold text-lg text-muted-foreground"
        data-testid={`text-skill-category-${category.toLowerCase().replace(/\//g, "-")}`}
      >
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {categorySkills.map((skill) => (
          <Badge
            key={skill.name}
            variant="outline"
            className="text-sm"
            data-testid={`badge-skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const featuredProjects = projects.filter((p) => p.featured);

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<Skill["category"], Skill[]>
  );

  const categoryOrder: Skill["category"][] = [
    "Languages/Frameworks",
    "Database Technologies",
    "Cloud/Dev Tools",
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="text-experience-page-heading"
            >
              Work Experience
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              My professional journey and the impact I've made along the way.
            </p>

            <div className="relative">
              <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-12">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-8 md:pl-20"
                    data-testid={`card-experience-${exp.id}`}
                  >
                    <div className="absolute left-0 md:left-8 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Badge variant="outline" className="w-fit">
                          <Calendar className="h-3 w-3 mr-1" />
                          {exp.startDate} — {exp.endDate}
                        </Badge>
                      </div>

                      <div>
                        <h3
                          className="font-semibold text-xl"
                          data-testid={`text-experience-role-${exp.id}`}
                        >
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span data-testid={`text-experience-org-${exp.id}`}>
                            {exp.organization}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {exp.bullets.map((bullet, idx) => (
                          <li
                            key={idx}
                            className="text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-education-heading"
            >
              Education
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Academic foundation and ongoing learning.
            </p>

            <Card className="max-w-3xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-3 rounded-md bg-primary/10">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3
                      className="font-semibold text-xl"
                      data-testid="text-edu-school"
                    >
                      {aboutInfo.education.school}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                      <span
                        className="text-primary font-medium"
                        data-testid="text-edu-degree"
                      >
                        {aboutInfo.education.degree}
                      </span>
                      <span className="text-muted-foreground">
                        {aboutInfo.education.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground" data-testid="text-edu-gpa">
                      GPA: {aboutInfo.education.gpa}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-edu-coursework">
                      <span className="font-medium">Relevant Coursework:</span>{" "}
                      {aboutInfo.education.coursework.join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-projects-heading"
            >
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Highlighted work from my portfolio.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="flex flex-col h-full transition-transform duration-200 hover:-translate-y-1"
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-md flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/30">
                      {project.title[0]}
                    </span>
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <Badge variant="secondary" className="flex-shrink-0">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="font-mono text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
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
                          >
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
          </div>
          </section>

          <section id="skills" className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <h2
                className="text-3xl md:text-4xl font-bold mb-12"
                data-testid="text-skills-heading"
              >
                Technical Skills
              </h2>

              <div className="space-y-10">
                {categoryOrder.map((category) => (
                  <SkillCategory
                    key={category}
                    category={category}
                    categorySkills={groupedSkills[category] || []}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}
