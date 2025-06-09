import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectMemberController } from "../controllers/project-member.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { Token } from "../enums/token";
import { restrictTo } from "../middlewares/permissions.middleware";
import { ProjectPermission } from "../../domain/types";

export class ProjectMemberRoutes extends BaseRoute {
  public path = "/project_members";

  protected initRoutes(): void {
    const controller = container.resolve(ProjectMemberController);

    // Add a member to a project
    this.router.post(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      controller.addMember.bind(controller)
    );

    // Update member permission
    this.router.patch(
      "/:memberId",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      controller.updatePermission.bind(controller)
    );

    // Remove a member from a project
    this.router.delete(
      "/:memberId",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      controller.removeMember.bind(controller)
    );

    // Get all members of a project
    this.router.get(
      "/:projectId",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.getProjectMembers.bind(controller)
    );
  }
}
