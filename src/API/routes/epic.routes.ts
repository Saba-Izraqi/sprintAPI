import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { EpicController } from "../controllers/epic.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Request, Response, NextFunction } from "express";

export class EpicRoutes extends BaseRoute {
  public path = "/project/:projectId/epic";

  protected initRoutes(): void {
    const controller = container.resolve(EpicController);

    
    this.router.use(authenticate);

    this.router.post("/", controller.createEpic.bind(controller));

    this.router.get("/", controller.getAllEpics.bind(controller));    
    this.router.get("/:id", controller.getEpicById.bind(controller));
    
   
    this.router.put("/:id", controller.updateEpic.bind(controller));
    
    this.router.delete("/:id", controller.deleteEpic.bind(controller));
  }
}
