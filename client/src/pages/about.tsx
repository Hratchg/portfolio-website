import { ArrowRight, Github, FileText, Mail } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { personalInfo, aboutInfo } from "@shared/portfolio";
import { GraduationCap, Sparkles, Target, Code2, Layers, Database, Wrench } from "lucide-react";
import { skills, type Skill } from "@shared/portfolio";

const categoryIcons = {
  Languages: Code2,
  Frameworks: Layers,
  "Data/ML": Database,
  Tools: Wrench,
};

const categoryColors = {
  Languages: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Frameworks: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Data/ML": "bg-green-500/10 text-green-600 dark:text-green-400",
  Tools: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

function SkillCategory({
  category,
  categorySkills,
}: {
  category: Skill["category"];
  categorySkills: Skill[];
}) {
  const Icon = categoryIcons[category];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${categoryColors[category]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3
          className="font-semibold text-lg"
          data-testid={`text-skill-category-${category.toLowerCase().replace(/\//g, "-")}`}
        >
          {category}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {categorySkills.map((skill) => (
          <Badge
            key={skill.name}
            variant="secondary"
            className="font-mono text-sm"
            data-testid={`badge-skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
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
    "Languages",
    "Frameworks",
    "Data/ML",
    "Tools",
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
        <section className="relative min-h-[70vh] flex items-center justify-center pt-16">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
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
              <Button size="lg" asChild data-testid="button-view-experience">
                <Link href="/experience">
                  View Experience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
              <Button
                size="icon"
                variant="ghost"
                asChild
                aria-label="Email"
                data-testid="button-email"
              >
                <a href={`mailto:${personalInfo.email}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12" data-testid="text-about-heading">
              About Me
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <p
                  className="text-lg text-muted-foreground leading-relaxed"
                  data-testid="text-about-bio"
                >
                  {aboutInfo.bio}
                </p>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground" data-testid="text-about-focus">
                    {aboutInfo.currentFocus}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-primary/10">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg" data-testid="text-education-school">
                          {aboutInfo.education.school}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-primary font-medium" data-testid="text-education-degree">
                            {aboutInfo.education.degree}
                          </span>
                          <span className="text-muted-foreground" data-testid="text-education-period">
                            {aboutInfo.education.period}
                          </span>
                        </div>
                        <p className="text-muted-foreground" data-testid="text-education-gpa">
                          GPA: {aboutInfo.education.gpa}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid="text-education-coursework">
                          <span className="font-medium">Relevant Coursework:</span>{" "}
                          {aboutInfo.education.coursework.join(", ")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {aboutInfo.interests.map((interest) => (
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

        <section id="skills" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-12"
              data-testid="text-skills-heading"
            >
              Skills
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
