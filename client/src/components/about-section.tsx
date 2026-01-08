import { GraduationCap, Sparkles, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aboutInfo } from "@shared/portfolio";

export function AboutSection() {
  return (
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
                  <div>
                    <h3 className="font-semibold" data-testid="text-education-school">
                      {aboutInfo.education.school}
                    </h3>
                    <p className="text-muted-foreground" data-testid="text-education-degree">
                      {aboutInfo.education.degree}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-education-period">
                      {aboutInfo.education.period}
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
  );
}
