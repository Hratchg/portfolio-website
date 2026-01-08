import { Code2, Layers, Database, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export function SkillsSection() {
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
  );
}
