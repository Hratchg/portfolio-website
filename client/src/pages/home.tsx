import { Link } from "wouter";
import { ArrowRight, Code, Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { personalInfo } from "@shared/portfolio";

export default function HomePage() {
  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <section className="relative min-h-[85vh] flex items-center justify-center pt-16">
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
              <div className="space-y-6">
                <p
                  className="text-lg text-muted-foreground font-medium"
                  data-testid="text-home-greeting"
                >
                  Welcome to my portfolio
                </p>
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                  data-testid="text-home-name"
                >
                  Hi, I'm{" "}
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {personalInfo.name.split(" ")[0]}
                  </span>
                </h1>
                <p
                  className="text-xl sm:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto"
                  data-testid="text-home-tagline"
                >
                  {personalInfo.tagline}
                </p>
                <p
                  className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
                  data-testid="text-home-intro"
                >
                  {personalInfo.intro}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
                <Button size="lg" asChild data-testid="button-explore-portfolio">
                  <Link href="/about">
                    Explore My Portfolio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  data-testid="button-view-work"
                >
                  <Link href="/experience">View My Work</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-12"
                data-testid="text-what-i-do"
              >
                What I Do
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Card data-testid="card-software-engineering">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 rounded-md bg-primary/10 mb-4">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Software Engineering</h3>
                    <p className="text-muted-foreground text-sm">
                      Building scalable web applications with modern frameworks and best practices.
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-data-science">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 rounded-md bg-primary/10 mb-4">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Data Science</h3>
                    <p className="text-muted-foreground text-sm">
                      Analyzing complex datasets and building data pipelines that drive insights.
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-machine-learning">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 rounded-md bg-primary/10 mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Machine Learning</h3>
                    <p className="text-muted-foreground text-sm">
                      Developing ML models and AI solutions to solve real-world problems.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}
