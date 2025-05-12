import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { BoardColumnController } from "../controllers/bourd-column.controller"; 

export class BoardColumnRoutes extends BaseRoute {
  public path = "/board-columns"; 

  protected initRoutes(): void {
    const controller = container.resolve(BoardColumnController);

    
    this.router.post(
      '/',
      controller.createBoardColumn.bind(controller)
    );

   
    this.router.get(
      '/',
      controller.getAllBoardColumns.bind(controller)
    );


    this.router.get(
      '/:id',
      
      controller.getBoardColumnById.bind(controller)
    );

  
    this.router.put(
      '/:id',
      controller.updateBoardColumn.bind(controller)
    );

    
    this.router.delete(
      '/:id',
      controller.deleteBoardColumn.bind(controller)
    );
  }
}