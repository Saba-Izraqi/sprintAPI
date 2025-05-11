import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { BoardColumnController } from "../controllers/bourd-column.controller"; // Ensure this path is correct
// import { authenticate } from "../middlewares/auth.middleware"; // Uncomment if you add authentication

export class BoardColumnRoutes extends BaseRoute {
  public path = "/board-columns"; // This defines the base segment for this group of routes

  protected initRoutes(): void {
    const controller = container.resolve(BoardColumnController);

    // POST / - Create a new board column
    // Mounted at: /api/v1/board-columns/
    this.router.post(
      '/',
      // authenticate, // Add if authentication is needed
      controller.createBoardColumn.bind(controller)
    );

    // GET / - Get all board columns
    // Mounted at: /api/v1/board-columns/
    this.router.get(
      '/',
      // authenticate, // Add if authentication is needed
      controller.getAllBoardColumns.bind(controller)
    );

    // GET /:id - Get a specific board column by ID
    // Mounted at: /api/v1/board-columns/:id
    this.router.get(
      '/:id',
      // authenticate, // Add if authentication is needed
      controller.getBoardColumnById.bind(controller)
    );

    // PUT /:id - Update a specific board column by ID
    // Mounted at: /api/v1/board-columns/:id
    this.router.put(
      '/:id',
      // authenticate, // Add if authentication is needed
      controller.updateBoardColumn.bind(controller)
    );

    // DELETE /:id - Delete a specific board column by ID
    // Mounted at: /api/v1/board-columns/:id
    this.router.delete(
      '/:id',
      // authenticate, // Add if authentication is needed
      controller.deleteBoardColumn.bind(controller)
    );
  }
}