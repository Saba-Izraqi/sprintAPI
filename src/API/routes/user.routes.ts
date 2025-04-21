import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

export class UserRoutes extends BaseRoute {
  public path = "/auth";

  protected initRoutes(): void {
    const controller = container.resolve(UserController);

    this.router.post("/register", controller.registerUser.bind(controller));
    this.router.post("/login", controller.loginUser.bind(controller));
    this.router.post(
      "/verify-email",
      authenticate,
      controller.verifyEmail.bind(controller)
    );
    this.router.post(
      "forget-password",
      controller.forgetPassword.bind(controller)
    );
    this.router.post(
      "/password-reset",
      authenticate,
      controller.resetPassword.bind(controller)
    );
  }
}
