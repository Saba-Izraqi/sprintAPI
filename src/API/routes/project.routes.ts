import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectController } from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { validateDTO } from "../middlewares/validation.middleware";
import { Token } from "../enums/token";
import { restrictTo } from "../middlewares/permissions.middleware";
import { ProjectPermission } from "../../domain/types";
import { CreateProjectDto, UpdateProjectDTO } from "../../domain/DTOs/projectDTO";

export class ProjectRoutes extends BaseRoute {
  public path = "/project";

  protected initRoutes(): void {
    const controller = container.resolve(ProjectController);    this.router.post(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      validateDTO(CreateProjectDto),
      controller.create.bind(controller)
    );

    this.router.patch(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      validateDTO(UpdateProjectDTO),
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
