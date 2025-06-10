import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectMembersController } from '../controllers/project-member.controller';

export class ProjectMembersRoutes extends BaseRoute {
  public path: string = "/:projectId/members";

  protected initRoutes(): void {
    const controller = container.resolve(ProjectMembersController);

    this.router.post(this.path, controller.add.bind(controller));
  }
}
