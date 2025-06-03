import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectController } from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { Token } from "../enums/token";
import { restrictTo } from "../middlewares/permissions.middleware";
import { ProjectPermission } from "../../domain/enums/types";

export class ProjectRoutes extends BaseRoute {
  public path = "/project";

  /**
   ** POST api/v1/project/ { body: { ...dto } }
   ** patch api/v1/project/ { body: { ...dto } }
   ** DELETE api/v1/project/:id
    ** GET api/v1/project/ { query: { ...FindProjectOptions } }
   */
  protected initRoutes(): void {
    const controller = container.resolve(ProjectController);

    this.router.post(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.create.bind(controller)
    );

    this.router.patch(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      controller.update.bind(controller)
    );

    this.router.delete(
      "/:id",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      controller.delete.bind(controller)
    );

    this.router.get(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.find.bind(controller)
    );
  }
}
