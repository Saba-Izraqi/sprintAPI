import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectMemberController } from "../controllers/project-member.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { validateDTO, validateDTOWithParams } from "../middlewares/validation.middleware";
import { Token } from "../enums/token";
import { restrictTo } from "../middlewares/permissions.middleware";
import { ProjectPermission } from "../../domain/types";
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "../../domain/DTOs/project-memberDTO";
import { Router } from "express";

export class ProjectMemberRoutes extends BaseRoute {
  public path = "/project/:projectId/project-members";

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.initRoutes();
  }

  protected initRoutes(): void {
    const controller = container.resolve(ProjectMemberController);

    // Add a member to a project
    this.router.post(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      validateDTOWithParams(CreateProjectMemberDto, ["projectId"]),
      controller.addMember.bind(controller)
    );

    // Update member permission
    this.router.patch(
      "/:memberId",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.ADMINISTRATOR),
      validateDTO(UpdateProjectMemberDto),
      controller.updateMemberPermission.bind(controller)
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
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.getProjectMembers.bind(controller)
    );

    // Check user permission in a project
    this.router.get(
      "/check/:userId",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.checkUserPermission.bind(controller)
    );
  }
}
