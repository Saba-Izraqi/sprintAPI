import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { UserService } from "../../app/services/user.service";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  registerUser = async (req: Request, res: Response) => {
    console.debug("hello from controller");
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  };
}
