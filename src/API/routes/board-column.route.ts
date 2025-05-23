import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { BoardColumnController } from '../controllers/board-column.controller';

export class BoardColumnRoutes extends BaseRoute {
  public path = '/board-columns';

  protected initRoutes(): void {
    const controller = container.resolve(BoardColumnController);

    // POST /board-columns
    this.router.post(
      '/', 
      (req, res, next) => controller.createBoardColumn(req, res, next)
    );

    // GET /board-columns
    this.router.get(
      '/',
      (req, res, next) => controller.getAllBoardColumns(req, res, next)
    );

    // GET /board-columns/:id
    this.router.get(
      '/:id',
      (req, res, next) => controller.getBoardColumnById(req, res, next)
    );

    // PATCH /board-columns/:id
    this.router.patch(
      '/:id',
      (req, res, next) => controller.updateBoardColumn(req, res, next)
    );

    // DELETE /board-columns/:id
    this.router.delete(
      '/:id',
      (req, res, next) => controller.deleteBoardColumn(req, res, next)
    );
  }
}
