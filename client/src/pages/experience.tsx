import { Briefcase, GraduationCap, Calendar, Code, MapPin, Mail } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RevealFx } from "@/components/reveal-fx";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Editable } from "@/components/editable";
import { EditableList, DeleteButton } from "@/components/editable-list";
import { EditableBullets } from "@/components/editable-bullets";
import { EditableSelect, EditableToggle } from "@/components/editable-select";
import { useEditMode } from "@/lib/edit-context";
import type { Experience, AboutInfo, Project, Skill, PersonalInfo } from "@/lib/types";
import { Loader2 } from "lucide-react";
import {
  SiPython,
  SiDjango,
  SiJavascript,
  SiSpringboot,
  SiNodedotjs,
  SiReact,
  SiExpress,
  SiCplusplus,
  SiPhp,
  SiPostgresql,
  SiMongodb,
  SiSupabase,
  SiMariadb,
  SiAmazonrds,
  SiGithub,
  SiDocker,
  SiJira,
  SiAmazonwebservices,
  SiPostman,
  SiKubernetes,
  SiJenkins,
  SiIntellijidea,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";

const skillIcons: Record<string, IconType> = {
  "Python": SiPython,
  "Django": SiDjango,
  "JavaScript": SiJavascript,
  "Java": FaJava,
  "Spring Boot": SiSpringboot,
  "Node.js": SiNodedotjs,
  "React.js": SiReact,
  "Express.js": SiExpress,
  "C++": SiCplusplus,
  "PHP": SiPhp,
  "PostgreSQL": SiPostgresql,
  "MongoDB Atlas": SiMongodb,
  "Supabase": SiSupabase,
  "MariaDB/MySQL": SiMariadb,
  "AWS RDS": SiAmazonrds,
  "Git/GitHub": SiGithub,
  "Docker": SiDocker,
  "Jira": SiJira,
  "AWS": SiAmazonwebservices,
  "Postman": SiPostman,
  "Kubernetes": SiKubernetes,
  "Jenkins": SiJenkins,
  "VSCode": Code as IconType,
  "IntelliJ IDEA": SiIntellijidea,
};

function SkillCategory({
  category,
  categorySkills,
  isEditMode,
  onAddSkill,
  onDeleteSkill,
}: {
  category: Skill["category"];
  categorySkills: Skill[];
  isEditMode: boolean;
  onAddSkill: (category: Skill["category"]) => void;
  onDeleteSkill: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3
        className="text-[24px] font-bold text-foreground"
        data-testid={`text-skill-category-${category.toLowerCase().replace(/\//g, "-")}`}
      >
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {categorySkills.map((skill) => {
          const Icon = skillIcons[skill.name];
          return (
            <Badge
              key={skill.id}
              variant="outline"
              className="text-sm gap-1.5 relative group"
              data-testid={`badge-skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {skill.name}
              {isEditMode && (
                <button
                  className="ml-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeleteSkill(skill.id)}
                  aria-label={`Delete ${skill.name}`}
                >
                  <span className="text-xs leading-none">×</span>
                </button>
              )}
            </Badge>
          );
        })}
        {isEditMode && (
          <Button
            variant="outline"
            size="sm"
            className="border-dashed border border-muted-foreground/30 hover:border-primary/50 text-muted-foreground hover:text-primary h-6 text-xs"
            onClick={() => onAddSkill(category)}
          >
            + Add Skill
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const { data: experiencesData, isLoading: expLoading } = useContent<Experience[]>("/api/content/experiences");
  const { data: aboutInfoData, isLoading: aboutLoading } = useContent<AboutInfo>("/api/content/about");
  const { data: skillsData, isLoading: skillsLoading } = useContent<Skill[]>("/api/content/skills");
  const { data: personalInfo, isLoading: piLoading } = useContent<PersonalInfo>("/api/content/personal-info");
  const { changes, addChange, isEditMode } = useEditMode();

  if (expLoading || aboutLoading || skillsLoading || piLoading) {
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

  const experiences = experiencesData ?? [];
  const aboutInfo = aboutInfoData;
  const skills = skillsData ?? [];

  const isDeleted = (table: string, id: string) =>
    changes.some((c) => c.type === "delete" && c.table === table && c.id === id);

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

  const handleAddExperience = () => {
    addChange({
      type: "create",
      table: "experiences",
      data: { role: "New Role", organization: "Organization", location: "Location", startDate: "Start", endDate: "Present", bullets: ["Description"], sortOrder: (experiencesData?.length ?? 0) },
    });
  };

  const handleAddSkill = (category: Skill["category"]) => {
    addChange({
      type: "create",
      table: "skills",
      data: { name: "New Skill", category, sortOrder: (skills.filter((s) => s.category === category).length) },
    });
  };

  const handleDeleteSkill = (id: string) => {
    if (confirm("Delete this skill?")) {
      addChange({ type: "delete", table: "skills", id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Two-column header like Matthew's about page */}
        {personalInfo && (
          <section className="py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                {/* Left sidebar — avatar, location, languages */}
                <RevealFx delay={0} translateY={16} className="md:w-52 flex-shrink-0">
                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="w-36 h-36 rounded-full overflow-hidden">
                    <img src="/profile.jpg" alt={personalInfo.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    California, USA
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">English</Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Armenian</Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Arabic</Badge>
                  </div>
                </div>
                </RevealFx>

                {/* Right content — name, title, social, bio */}
                <div className="flex-1">
                  <RevealFx delay={0} translateY={16}>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                      {personalInfo.name}
                    </h1>
                  </RevealFx>
                  <RevealFx delay={0.15} translateY={16}>
                    <p className="text-2xl md:text-3xl text-muted-foreground mt-2">
                      Student · Data Scientist · Software Engineer
                    </p>
                  </RevealFx>

                  <RevealFx delay={0.3} translateY={16}>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <Button variant="outline" className="rounded-full gap-2" asChild>
                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                          <SiLinkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                      <Button variant="outline" className="rounded-full gap-2" asChild>
                        <a href={`mailto:${personalInfo.email}`}>
                          <Mail className="h-4 w-4" />
                          Email
                        </a>
                      </Button>
                      <Button variant="outline" className="rounded-full gap-2" asChild>
                        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      </Button>
                    </div>
                  </RevealFx>

                  <RevealFx delay={0.45} translateY={20}>
                    <p className="text-base text-foreground leading-relaxed mt-8 max-w-2xl">
                      I am currently a Data Science and Statistics student at UCSB. I work with full-stack development, machine learning with an emphasis on natural language processing, data collection and cleaning. This site includes my work experience and information on projects I've worked on. Please feel free to reach out always looking forward to connecting.
                    </p>
                  </RevealFx>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <RevealFx delay={0.6} translateY={20}>
            <h1
              className="text-4xl md:text-5xl font-bold mb-12"
              data-testid="text-experience-page-heading"
            >Work Experience</h1>
            </RevealFx>

            <EditableList table="experiences" onAdd={handleAddExperience} addLabel="Add Experience">
              <div className="space-y-16">
                {experiences.map((exp, i) => (
                  <RevealFx key={exp.id} delay={0.75 + i * 0.15} translateY={20}>
                  <div
                    data-testid={`card-experience-${exp.id}`}
                    className={`relative group ${isDeleted("experiences", exp.id) ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <DeleteButton table="experiences" id={exp.id} label="experience" />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                      <div>
                        <Editable
                          value={exp.organization}
                          table="experiences"
                          id={exp.id}
                          field="organization"
                          as="h3"
                          className="font-bold text-2xl"
                          data-testid={`text-experience-org-${exp.id}`}
                        />
                        <Editable
                          value={exp.role}
                          table="experiences"
                          id={exp.id}
                          field="role"
                          as="p"
                          className="text-primary font-medium"
                          data-testid={`text-experience-role-${exp.id}`}
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">
                          <Editable value={exp.startDate} table="experiences" id={exp.id} field="startDate" as="span" /> - <Editable value={exp.endDate} table="experiences" id={exp.id} field="endDate" as="span" />
                        </p>
                        <p className="text-muted-foreground text-sm">
                          <Editable value={exp.location} table="experiences" id={exp.id} field="location" as="span" />
                        </p>
                      </div>
                    </div>

                    <EditableBullets bullets={exp.bullets as string[]} table="experiences" id={exp.id} field="bullets" />
                  </div>
                  </RevealFx>
                ))}
              </div>
            </EditableList>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <RevealFx delay={1.65} translateY={20}>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-education-heading"
            >
              Education
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Academic foundation and ongoing learning.
            </p>
            </RevealFx>

            {aboutInfo && (
              <RevealFx delay={1.8} translateY={20}>
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
              </RevealFx>
            )}
          </div>
        </section>

          <section id="skills" className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <RevealFx delay={1.95} translateY={20}>
              <h2
                className="text-3xl md:text-4xl font-bold mb-12"
                data-testid="text-skills-heading"
              >
                Technical Skills
              </h2>
              </RevealFx>

              <div className="space-y-10">
                {categoryOrder.map((category, j) => (
                  <RevealFx key={category} delay={2.1 + j * 0.15} translateY={20}>
                  <SkillCategory
                    category={category}
                    categorySkills={(groupedSkills[category] || []).filter((s) => !isDeleted("skills", s.id))}
                    isEditMode={isEditMode}
                    onAddSkill={handleAddSkill}
                    onDeleteSkill={handleDeleteSkill}
                  />
                  </RevealFx>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
  );
}
