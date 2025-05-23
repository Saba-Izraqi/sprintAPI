import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { ProjectMemberController } from '../controllers/project-member.controller';
import { authenticate } from '../middlewares/auth.middleware';

export class ProjectMemberRoutes extends BaseRoute {
  public path = '/project-members';

  protected initRoutes(): void {
    const controller = container.resolve(ProjectMemberController);    // POST /project-members
    this.router.post(
      '/', 
      authenticate,
      (req, res, next) => controller.createMember(req, res, next)
    );

    // GET /project-members
    this.router.get(
      '/',
      authenticate,
      (req, res, next) => controller.getAllMembers(req, res, next)
    );

    // GET /project-members/:id
    this.router.get(
      '/:id',
      authenticate,
      (req, res, next) => controller.getMemberById(req, res, next)
    );
      // GET /project-members/project/:projectId
    this.router.get(
      '/project/:projectId',
      authenticate,
      (req, res, next) => controller.getMembersByProject(req, res, next)
    );
    
    // GET /project-members/user/:userId
    this.router.get(
      '/user/:userId',
      authenticate,
      (req, res, next) => controller.getMembershipsByUser(req, res, next)
    );
    
    // GET /project-members/membership/:userId/:projectId
    this.router.get(
      '/membership/:userId/:projectId',
      authenticate,
      (req, res, next) => controller.getMembership(req, res, next)
    );    // PATCH /project-members/:id
    this.router.patch(
      '/:id',
      authenticate,
      (req, res, next) => controller.updateMember(req, res, next)
    );
      // DELETE /project-members/:id
    this.router.delete(
      '/:id',
      authenticate,
      (req, res, next) => controller.deleteMember(req, res, next)
    );
  }
}
