import type { Express } from "express";
import { createServer, type Server } from "http";
import { contactMessageSchema } from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const result = contactMessageSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const message = await storage.createContactMessage(result.data);
      
      return res.status(200).json({
        message: "Message received successfully",
        data: message,
      });
    } catch (error) {
      console.error("Error processing contact message:", error);
      return res.status(500).json({
        message: "Failed to process message",
      });
    }
  });

  return httpServer;
}
