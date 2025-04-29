import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectController } from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Router } from "express";

export class ProjectRoutes extends BaseRoute {
  public path = "/projects";
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.initRoutes();
  }

  protected initRoutes(): void {
    const controller = container.resolve(ProjectController);

    // Using arrow functions to properly bind 'this' and satisfy Express types
    this.router.post("/", authenticate, (req, res) => controller.createProject(req, res));
    this.router.get("/", (req, res) => controller.getAllProjects(req, res));
    this.router.get("/:id", (req, res) => controller.getProject(req, res));
    this.router.put("/:id", authenticate, (req, res) => controller.updateProject(req, res));
    this.router.delete("/:id", authenticate, (req, res) => controller.deleteProject(req, res));
    this.router.get("/user/:userId", (req, res) => controller.getUserProjects(req, res));
  }
}