import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { UserService } from "../../app/services/user.service";
import { validate } from "class-validator";
import {
  RegisterUserDto,
  LoginUserDto,
  UserResponseDto,
} from "../../domain/DTOs/userDTO";
import { sign } from "jsonwebtoken";
import { success } from "console";
import { Token } from "../enums/token";

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
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        tokenType: Token.ACCESS,
      },
      "secretKeyPlaceHolderWillReplaceLater",
      { expiresIn: "24h" }
    );

    const emailVerificationToken = sign(
      {
        userId: user.id,
        email: user.email,
        tokenType: Token.EMAIL_VERIFICATION,
      },
      "secretKeyPlaceHolderWillReplaceLater",
      { expiresIn: "24h" }
    );
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
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        tokenType: Token.ACCESS,
      },
      "secretKeyPlaceHolderWillReplaceLater",
      { expiresIn: "24h" }
    );
    res.status(200).json({ user, token, success: true });
  }

  async verifyEmail(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await this.userService.updateEmailVerification(email, true);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", success: false });
    }
  }

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    const token = sign(
      {
        email,
        tokenType: Token.RESET_PASSWORD,
      },
      "secretKeyPlaceHolderWillReplaceLater",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      success: true,
    });
  }

  async resetPassword(req: Request, res: Response) {
    const { oldPassword, password, email, forget } = req.body;
    await this.userService.resetPassword(
      email,
      password,
      !forget ? oldPassword : null
    );
    res.status(200).json({
      success: true,
    });
  }
}
