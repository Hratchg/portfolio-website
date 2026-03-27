import { db } from "./storage";
import { randomUUID } from "crypto";
import {
  personalInfo as personalInfoTable,
  aboutInfo as aboutInfoTable,
  projects as projectsTable,
  experiences as experiencesTable,
  skills as skillsTable,
  navLinks as navLinksTable,
  adminUser as adminUserTable,
} from "@shared/schema";
import {
  personalInfo,
  aboutInfo,
  projects,
  experiences,
  skills,
  navLinks,
} from "@shared/portfolio";

export async function seed() {
  const existing = await db.select().from(personalInfoTable);
  if (existing.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database from portfolio.ts...");

  await db.insert(personalInfoTable).values({
    id: "main",
    name: personalInfo.name,
    tagline: personalInfo.tagline,
    intro: personalInfo.intro,
    email: personalInfo.email,
    github: personalInfo.github,
    linkedin: personalInfo.linkedin,
    resumeUrl: personalInfo.resumeUrl,
  });

  await db.insert(aboutInfoTable).values({
    id: "main",
    bio: aboutInfo.bio,
    currentFocus: aboutInfo.currentFocus,
    education: aboutInfo.education,
    interests: aboutInfo.interests,
  });

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await db.insert(projectsTable).values({
      id: p.id,
      title: p.title,
      description: p.description,
      highlights: p.highlights,
      techStack: p.techStack,
      category: p.category,
      featured: p.featured,
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      sortOrder: i,
    });
  }

  for (let i = 0; i < experiences.length; i++) {
    const e = experiences[i];
    await db.insert(experiencesTable).values({
      id: e.id,
      role: e.role,
      organization: e.organization,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.bullets,
      sortOrder: i,
    });
  }

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i];
    await db.insert(skillsTable).values({
      id: randomUUID(),
      name: s.name,
      category: s.category,
      sortOrder: i,
    });
  }

  for (let i = 0; i < navLinks.length; i++) {
    const n = navLinks[i];
    await db.insert(navLinksTable).values({
      id: randomUUID(),
      label: n.label,
      href: n.href,
      icon: n.icon,
      sortOrder: i,
    });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (adminUsername && adminPasswordHash) {
    await db.insert(adminUserTable).values({
      id: "admin",
      username: adminUsername,
      passwordHash: adminPasswordHash,
    });
    console.log("Admin user seeded.");
  } else {
    console.warn("ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set — skipping admin user seed.");
  }

  console.log("Database seeded successfully.");
}
