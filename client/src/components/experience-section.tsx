import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { experiences } from "@shared/portfolio";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          data-testid="text-experience-heading"
        >
          Experience
        </h2>

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative pl-8 md:pl-20"
                data-testid={`card-experience-${exp.id}`}
              >
                <div className="absolute left-0 md:left-8 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Badge variant="outline" className="w-fit">
                      {exp.startDate} — {exp.endDate}
                    </Badge>
                  </div>

                  <div>
                    <h3
                      className="font-semibold text-lg"
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
  );
}
