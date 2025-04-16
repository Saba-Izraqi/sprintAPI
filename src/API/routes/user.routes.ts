import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { UserController } from "../controllers/user.controller";

export class UserRoutes extends BaseRoute {
  public path = "/auth";

  protected initRoutes(): void {
    const controller = container.resolve(UserController);
    this.router.post("/register", controller.registerUser);
  }
}

