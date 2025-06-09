import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

export class UsersRoutes extends BaseRoute {
  public path = "/users";

  protected initRoutes(): void {
    const controller = container.resolve(UserController);

    this.router.get("/", authenticate, controller.getAllUsers.bind(controller));
  }
}
