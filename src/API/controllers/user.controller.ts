import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { UserService } from "../../app/services/user.service";
import { validate } from "class-validator";
import { RegisterUserDto, LoginUserDto, UserResponseDto } from "../../domain/DTOs/userDTO";
import { sign } from "jsonwebtoken";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) { }

  async registerUser(req: Request, res: Response) {
    const dto = Object.assign(new RegisterUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    const user = await this.userService.registerUser(dto);
    const token = sign(
      { userId: user.id, email: user.email, isEmailVerified: user.isEmailVerified },
      "secretKeyPlaceHolderWillReplaceLater",
      { expiresIn: "24h" }
    );
    res.status(201).json({ user, token });
  }

  async loginUser(req: Request, res: Response) {
    const dto = Object.assign(new LoginUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    const user = await this.userService.loginUser(dto);
    const token = sign(
      { userId: user.id, email: user.email, isEmailVerified: user.isEmailVerified },
      "secretKeyPlaceHolderWillReplaceLater",
      { expiresIn: "24h" }
    );
    res.status(200).json({ user, token });
  }
}
