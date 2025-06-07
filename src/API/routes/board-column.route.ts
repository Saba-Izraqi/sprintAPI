import { authenticate } from "../middlewares/auth.middleware";
import { BaseRoute } from "./base.route";
import { BoardColumnController } from "../controllers/board-column.controller";
import { container } from "tsyringe";
import { ProjectPermission } from "../../domain/types/enums";
import { restrictTo } from "../middlewares/permissions.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { Token } from "../enums/token";

export class BoardColumnRoutes extends BaseRoute {
  public path = "/board-column";

  protected initRoutes(): void {
    const controller = container.resolve(BoardColumnController);

    this.router.post(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.create.bind(controller)
    );

    this.router.patch(
      "/:id",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.update.bind(controller)
    );

    this.router.delete(
      "/:id",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.delete.bind(controller)
    );

    this.router.get(
      "/:projectId",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.get.bind(controller)
    );
  }
}
