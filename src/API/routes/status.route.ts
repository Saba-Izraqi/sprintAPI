import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { StatusController } from '../controllers/status.controller';

export class StatusRoutes extends BaseRoute {
  public path = '/statuses';

  protected initRoutes(): void {
    const controller = container.resolve(StatusController);

    // POST /statuses
    this.router.post(
      '/', 
      (req, res, next) => controller.createStatus(req, res, next)
    );

    // GET /statuses
    this.router.get(
      '/',
      (req, res, next) => controller.getAllStatuses(req, res, next)
    );

    // GET /statuses/:id
    this.router.get(
      '/:id',
      (req, res, next) => controller.getStatusById(req, res, next)
    );
    
    // GET /statuses/type/:type
    this.router.get(
      '/type/:type',
      (req, res, next) => controller.getStatusesByType(req, res, next)
    );
    
    // GET /statuses/column/:columnId
    this.router.get(
      '/column/:columnId',
      (req, res, next) => controller.getStatusesByColumn(req, res, next)
    );

    // PATCH /statuses/:id
    this.router.patch(
      '/:id',
      (req, res, next) => controller.updateStatus(req, res, next)
    );

    // DELETE /statuses/:id
    this.router.delete(
      '/:id',
      (req, res, next) => controller.deleteStatus(req, res, next)
    );
  }
}
