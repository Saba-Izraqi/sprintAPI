import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { BoardController } from '../controllers/board.controller';
import { authenticate } from '../middlewares/auth.middleware';

export class BoardRoutes extends BaseRoute {
  public path = '/boards';

  protected initRoutes(): void {
    const controller = container.resolve(BoardController);    // POST /boards
    this.router.post(
      '/', 
      authenticate,
      (req, res, next) => controller.createBoard(req, res, next)
    );

    // GET /boards
    this.router.get(
      '/',
      authenticate,
      (req, res, next) => controller.getAllBoards(req, res, next)
    );

    // GET /boards/:projectId
    this.router.get(
      '/:projectId',
      authenticate,
      (req, res, next) => controller.getBoardByProjectId(req, res, next)
    );    // PATCH /boards/:projectId
    this.router.patch(
      '/:projectId',
      authenticate,
      (req, res, next) => controller.updateBoard(req, res, next)
    );

    // DELETE /boards/:projectId
    this.router.delete(
      '/:projectId',
      authenticate,
      (req, res, next) => controller.deleteBoard(req, res, next)
    );
  }
}
