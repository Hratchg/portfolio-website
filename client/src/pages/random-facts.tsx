import { Coffee, Mountain, Crown, Globe, Music, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { randomFacts } from "@shared/portfolio";

const iconMap: Record<string, typeof Coffee> = {
  coffee: Coffee,
  hiking: Mountain,
  chess: Crown,
  languages: Globe,
  music: Music,
  cooking: ChefHat,
};

const colorMap: Record<string, string> = {
  coffee: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hiking: "bg-green-500/10 text-green-600 dark:text-green-400",
  chess: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  languages: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  music: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  cooking: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export default function RandomFactsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="text-random-facts-heading"
            >
              Random Facts
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
              Beyond the code and data, here are some fun things about me that make me who I am.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {randomFacts.map((fact) => {
                const Icon = iconMap[fact.emoji] || Coffee;
                const colorClass = colorMap[fact.emoji] || "bg-primary/10 text-primary";

                return (
                  <Card
                    key={fact.id}
                    className="transition-transform duration-200 hover:-translate-y-1"
                    data-testid={`card-fact-${fact.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-md ${colorClass}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                          <h3
                            className="font-semibold text-lg"
                            data-testid={`text-fact-title-${fact.id}`}
                          >
                            {fact.title}
                          </h3>
                          <p
                            className="text-muted-foreground text-sm leading-relaxed"
                            data-testid={`text-fact-desc-${fact.id}`}
                          >
                            {fact.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to know more?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              I'm always happy to chat about coffee recommendations, hiking trails, 
              or anything else. Feel free to reach out!
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
