import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { ProjectController } from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth.middleware';

export class ProjectRoutes extends BaseRoute {
  public path = '/projects';

  protected initRoutes(): void {
    const controller = container.resolve(ProjectController);    // POST /projects
    this.router.post(
      '/', 
      authenticate, // Add authentication middleware to verify the JWT token
      (req, res, next) => controller.createProject(req, res, next)
    );    // GET /projects
    this.router.get(
      '/',
      authenticate,
      (req, res, next) => controller.getAllProjects(req, res, next)
    );

    // GET /projects/:id
    this.router.get(
      '/:id',
      authenticate,
      (req, res, next) => controller.getProjectById(req, res, next)
    );
    
    // GET /projects/creator/:userId
    this.router.get(
      '/creator/:userId',
      authenticate,
      (req, res, next) => controller.getProjectsByCreator(req, res, next)
    );

    // PATCH /projects/:id
    this.router.patch(
      '/:id',
      authenticate,
      (req, res, next) => controller.updateProject(req, res, next)
    );

    // DELETE /projects/:id
    this.router.delete(
      '/:id',
      authenticate,
      (req, res, next) => controller.deleteProject(req, res, next)
    );
  }
}
