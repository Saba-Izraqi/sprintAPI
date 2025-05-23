import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { EpicController } from "../controllers/epic.controller";
import { authenticate } from "../middlewares/auth.middleware";

export class EpicRoutes extends BaseRoute {
  public path = "/epics";

  protected initRoutes(): void {
    const controller = container.resolve(EpicController);

    // Apply authentication middleware to all epic routes
    this.router.use(authenticate);
    
    // Get all epics for a project
    this.router.get("/project/:projectId", controller.getAllEpics.bind(controller));
    
    // Get a specific epic by ID
    this.router.get("/:id", controller.getEpicById.bind(controller));
    
    // Get a specific epic by key and project
    this.router.get("/key/:key/project/:projectId", controller.getEpicByKey.bind(controller));
    
    // Create a new epic
    this.router.post("/", controller.createEpic.bind(controller));
    
    // Update an epic
    this.router.put("/:id", controller.updateEpic.bind(controller));
    
    // Delete an epic
    this.router.delete("/:id", controller.deleteEpic.bind(controller));
  }
}
