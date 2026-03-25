import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// --- Content Tables ---

export const personalInfo = pgTable("personal_info", {
  id: varchar("id").primaryKey().default("main"),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  intro: text("intro").notNull(),
  email: text("email").notNull(),
  github: text("github").notNull(),
  linkedin: text("linkedin").notNull(),
  resumeUrl: text("resume_url").notNull(),
});

export const aboutInfo = pgTable("about_info", {
  id: varchar("id").primaryKey().default("main"),
  bio: text("bio").notNull(),
  currentFocus: text("current_focus").notNull(),
  education: jsonb("education").notNull(),
  interests: jsonb("interests").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  highlights: jsonb("highlights").notNull(),
  techStack: jsonb("tech_stack").notNull(),
  category: varchar("category").notNull(),
  featured: boolean("featured").notNull().default(false),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const experiences = pgTable("experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  bullets: jsonb("bullets").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: varchar("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const randomFacts = pgTable("random_facts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emoji: text("emoji").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const navLinks = pgTable("nav_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminUser = pgTable("admin_user", {
  id: varchar("id").primaryKey().default("admin"),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
});

// --- Zod Schemas ---

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
