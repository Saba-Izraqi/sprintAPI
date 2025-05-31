import { Router } from "express";
import { container } from "tsyringe";
import { SprintController } from "../controllers/sprint.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { Token } from "../enums/token";
import { BaseRoute } from "./base.route";

export class SprintRoutes extends BaseRoute {
  public path = "/:projectId/sprint";

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.initRoutes();
  }

  protected initRoutes(): void {
    const controller = container.resolve(SprintController);
    this.router.use(authenticate);
    this.router.use(restrictTokens(Token.ACCESS));
    this.router.get("/", controller.getAll.bind(controller));
    this.router.get("/:id", controller.getById.bind(controller));
    this.router.post("/", controller.create.bind(controller));
    this.router.patch("/:id", controller.update.bind(controller));
    this.router.delete("/:id", controller.delete.bind(controller));
  }
}
