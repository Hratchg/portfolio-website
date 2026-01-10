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
import { Sparkles, Target } from "lucide-react";

export default function AboutPage() {
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

        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}
