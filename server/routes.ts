import type { Express } from "express";
import type { Server } from "http";
import { contactMessageSchema } from "@shared/schema";
import {
  getPersonalInfo,
  getAboutInfo,
  getProjects,
  getExperiences,
  getSkills,
  getRandomFacts,
  getNavLinks,
  createContactMessage,
  updatePersonalInfo,
  updateAboutInfo,
  createProject,
  updateProject,
  deleteProject,
  createExperience,
  updateExperience,
  deleteExperience,
  createSkill,
  updateSkill,
  deleteSkill,
  createRandomFact,
  updateRandomFact,
  deleteRandomFact,
  createNavLink,
  updateNavLink,
  deleteNavLink,
  executeBatch,
} from "./storage";
import {
  requireAuth,
  loginRateLimiter,
  handleLogin,
  handleLogout,
  handleAuthStatus,
} from "./auth";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // --- Auth routes ---
  app.post("/api/auth/login", loginRateLimiter, handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/status", handleAuthStatus);

  // --- Public content routes ---
  app.get("/api/content/personal-info", async (_req, res) => {
    const data = await getPersonalInfo();
    return res.json(data);
  });

  app.get("/api/content/about", async (_req, res) => {
    const data = await getAboutInfo();
    return res.json(data);
  });

  app.get("/api/content/projects", async (_req, res) => {
    const data = await getProjects();
    return res.json(data);
  });

  app.get("/api/content/experiences", async (_req, res) => {
    const data = await getExperiences();
    return res.json(data);
  });

  app.get("/api/content/skills", async (_req, res) => {
    const data = await getSkills();
    return res.json(data);
  });

  app.get("/api/content/random-facts", async (_req, res) => {
    const data = await getRandomFacts();
    return res.json(data);
  });

  app.get("/api/content/nav-links", async (_req, res) => {
    const data = await getNavLinks();
    return res.json(data);
  });

  // --- Contact form (existing) ---
  app.post("/api/contact", async (req, res) => {
    const result = contactMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }
    const message = await createContactMessage(result.data);
    return res.json({ message: "Message received successfully", data: message });
  });

  // --- Protected content routes ---
  app.put("/api/content/personal-info", requireAuth, async (req, res) => {
    await updatePersonalInfo(req.body);
    return res.json({ message: "Updated" });
  });

  app.put("/api/content/about", requireAuth, async (req, res) => {
    await updateAboutInfo(req.body);
    return res.json({ message: "Updated" });
  });

  app.post("/api/content/projects", requireAuth, async (req, res) => {
    const project = await createProject(req.body);
    return res.json(project);
  });

  app.put("/api/content/projects/:id", requireAuth, async (req, res) => {
    await updateProject(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/projects/:id", requireAuth, async (req, res) => {
    await deleteProject(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/experiences", requireAuth, async (req, res) => {
    const experience = await createExperience(req.body);
    return res.json(experience);
  });

  app.put("/api/content/experiences/:id", requireAuth, async (req, res) => {
    await updateExperience(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/experiences/:id", requireAuth, async (req, res) => {
    await deleteExperience(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/skills", requireAuth, async (req, res) => {
    const skill = await createSkill(req.body);
    return res.json(skill);
  });

  app.put("/api/content/skills/:id", requireAuth, async (req, res) => {
    await updateSkill(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/skills/:id", requireAuth, async (req, res) => {
    await deleteSkill(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/random-facts", requireAuth, async (req, res) => {
    const fact = await createRandomFact(req.body);
    return res.json(fact);
  });

  app.put("/api/content/random-facts/:id", requireAuth, async (req, res) => {
    await updateRandomFact(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/random-facts/:id", requireAuth, async (req, res) => {
    await deleteRandomFact(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/nav-links", requireAuth, async (req, res) => {
    const link = await createNavLink(req.body);
    return res.json(link);
  });

  app.put("/api/content/nav-links/:id", requireAuth, async (req, res) => {
    await updateNavLink(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/nav-links/:id", requireAuth, async (req, res) => {
    await deleteNavLink(req.params.id);
    return res.json({ message: "Deleted" });
  });

  // --- Batch update ---
  app.put("/api/content/batch", requireAuth, async (req, res) => {
    try {
      await executeBatch(req.body);
      return res.json({ message: "Batch update successful" });
    } catch (error) {
      console.error("Batch update failed:", error);
      return res.status(500).json({ message: "Batch update failed" });
    }
  });

  return httpServer;
}
