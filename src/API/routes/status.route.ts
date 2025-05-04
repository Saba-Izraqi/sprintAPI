import { container } from "tsyringe";
import { BaseRoute } from "./base.route"; 
import { StatusController } from "../controllers/status.controller"; 
import { authenticate } from "../middlewares/auth.middleware"; 

export class StatusRoutes extends BaseRoute {
  public path = "/statuses";

  protected initRoutes(): void {
    const controller = container.resolve(StatusController);


    this.router.post(
        '/',
        authenticate,
        controller.createStatus.bind(controller)
    );

    this.router.get(
        '/',
        authenticate,
        controller.getAllStatuses.bind(controller)
    );

    this.router.get(
        '/column/:columnId',
        authenticate,
        controller.getStatusesByColumn.bind(controller)
    );

    this.router.get(
        '/:id',
        authenticate,
        controller.getStatus.bind(controller)
    );

    this.router.put(
        '/:id',
        authenticate,
        controller.updateStatus.bind(controller)
    );

    this.router.delete(
        '/:id',
        authenticate,
        controller.deleteStatus.bind(controller)
    );

    this.router.patch(
        '/:id/change-type',
        authenticate,
        controller.changeStatusType.bind(controller)
    );
  }
}