import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { SprintController } from '../controllers/sprint.controller';
import { authenticate } from '../middlewares/auth.middleware';

export class SprintRoutes extends BaseRoute {
  public path = '/sprints';

  protected initRoutes(): void {
    const controller = container.resolve(SprintController);    // POST /sprints
    this.router.post(
      '/', 
      authenticate,
      (req, res, next) => controller.createSprint(req, res, next)
    );    // GET /sprints
    this.router.get(
      '/',
      authenticate,
      (req, res, next) => controller.getAllSprints(req, res, next)
    );

    // GET /sprints/active
    this.router.get(
      '/active',
      authenticate,
      (req, res, next) => controller.getActiveSprints(req, res, next)
    );

    // GET /sprints/daterange
    this.router.get(
      '/daterange',
      (req, res, next) => controller.getSprintsByDateRange(req, res, next)
    );

    // GET /sprints/board/:boardProjectId
    this.router.get(
      '/board/:boardProjectId',
      (req, res, next) => controller.getSprintsByBoard(req, res, next)
    );
    
    // GET /sprints/:id
    this.router.get(
      '/:id',
      (req, res, next) => controller.getSprintById(req, res, next)
    );

    // PUT /sprints/:id
    this.router.put(
      '/:id',
      (req, res, next) => controller.updateSprint(req, res, next)
    );

    // DELETE /sprints/:id
    this.router.delete(
      '/:id',
      (req, res, next) => controller.deleteSprint(req, res, next)
    );
  }
}
