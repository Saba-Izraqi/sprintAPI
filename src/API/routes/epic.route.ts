import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { EpicController } from '../controllers/epic.controller';
import { authenticate } from '../middlewares/auth.middleware';

// No @injectable() needed here if not injecting anything into EpicRoutes itself
// and if EpicRoutes is instantiated directly or resolved without constructor args.
export class EpicRoutes extends BaseRoute {
  public path = '/epics'; // Base path for epic routes

  // No constructor needed if we resolve controller inside initRoutes

  protected initRoutes(): void {
    // Resolve EpicController from the tsyringe container
    const controller = container.resolve(EpicController);    // POST /epics
    this.router.post(
      '/',
      authenticate,
      (req, res, next) => controller.createEpic(req, res, next)
    );

    // GET /epics
    this.router.get(
      '/',
      authenticate,
      (req, res, next) => controller.getAllEpics(req, res, next)
    );

    // GET /epics/board/:boardProjectId/key/:key
    this.router.get(
      `${this.path}/board/:boardProjectId/key/:key`,
      (req, res, next) => controller.getEpicByKeyAndBoard(req, res, next)
    );

    // GET /epics/board/:boardProjectId
    this.router.get(
      `${this.path}/board/:boardProjectId`,
      (req, res, next) => controller.getEpicsByBoard(req, res, next)
    );
    
    // GET /epics/:id
    this.router.get(
      `${this.path}/:id`,
      (req, res, next) => controller.getEpicById(req, res, next)
    );

    // PUT /epics/:id
    this.router.put(
      `${this.path}/:id`,
      (req, res, next) => controller.updateEpic(req, res, next)
    );

    // DELETE /epics/:id
    this.router.delete(
      `${this.path}/:id`,
      (req, res, next) => controller.deleteEpic(req, res, next)
    );
  }
}