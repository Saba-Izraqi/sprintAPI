import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { UserService } from "../../app/services/user.service";
import { validate } from "class-validator";
import {
  RegisterUserDto,
  LoginUserDto,
  UserResponseDto,
} from "../../domain/DTOs/userDTO";
import { Token } from "../enums/token";
import { genToken } from "../utils/token";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async registerUser(req: Request, res: Response) {
    const dto = Object.assign(new RegisterUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors, success: false });
      return;
    }
    const user = await this.userService.registerUser(dto);
    const token = genToken({
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      tokenType: Token.ACCESS,
    });

    const emailVerificationToken = genToken({
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      tokenType: Token.EMAIL_VERIFICATION,
    });

    res
      .status(201)
      .json({ user, token, emailVerificationToken, success: true });
  }

  async loginUser(req: Request, res: Response) {
    const dto = Object.assign(new LoginUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors, success: false });
      return;
    }
    const user = await this.userService.loginUser(dto);
    const token = genToken({
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      tokenType: Token.ACCESS,
    });
    res.status(200).json({ user, token, success: true });
  }

  async verifyEmail(req: Request, res: Response) {
    const { email, tokenType } = req.body;

    try {
      const user = await this.userService.updateEmailVerification(email, true);
      res
        .status(200)
        .json({ success: true, user });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ error: "Internal server error", success: false });
    }
  }

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;

    const token = genToken({
      email,
      id: "unknown",
      isEmailVerified: false,
      tokenType: Token.RESET_PASSWORD,
    });

    res.status(200).json({
      token,
      success: true,
    });
  }

  async resetPassword(req: Request, res: Response) {
    const { oldPassword, password, email, tokenType } = req.body;

    const dto = Object.assign(new LoginUserDto(), {
      email: req.body.email,
      password: req.body.password,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors, success: false });
      return;
    }
    await this.userService.resetPassword(
      email,
      password,
      tokenType === Token.ACCESS ? oldPassword : null
    );
    res.status(200).json({
      success: true,
    });
  }
}
