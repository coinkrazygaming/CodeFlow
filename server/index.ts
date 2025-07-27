import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
} from "./routes/auth";
import { getProjects, createProject, deleteProject, deployProject } from "./routes/projects";
import { handleAIChat } from "./routes/ai-chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from CodeFlow AI!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/forgot-password", handleForgotPassword);

  // Project routes
  app.get("/api/projects", getProjects);
  app.post("/api/projects", createProject);
  app.delete("/api/projects/:projectId", deleteProject);
  app.post("/api/projects/:projectId/deploy", deployProject);

  // AI routes
  app.post("/api/ai/chat", handleAIChat);

  return app;
}
