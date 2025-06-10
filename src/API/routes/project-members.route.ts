import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectMembersController } from "../controllers/project-member.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { restrictTo } from '../middlewares/permissions.middleware';
import { ProjectPermission } from '../../domain/types';

export class ProjectMembersRoutes extends BaseRoute {
  public path: string = "/:projectId/members";

  protected initRoutes(): void {
    const controller = container.resolve(ProjectMembersController);

    this.router.post(
      this.path,
      authenticate,
      restrictTokens(),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      controller.add.bind(controller)
    );
  }
}
