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
import PostmarkSender from "../../infrastructure/email/postmarkSender";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async registerUser(req: Request, res: Response) {
    const dto = Object.assign(new RegisterUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length) {
      res.status(400).json({ errors, success: false });
      return;
    }
    try {
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

      const emailConfirmationURL = `http://localhost:5173/verify-email?token=${emailVerificationToken}`;
      PostmarkSender.instance.send(
        user.fullName,
        user.email,
        emailConfirmationURL,
        "email-confirmation"
      );
      res
        .status(201)
        .json({ user, token, emailVerificationToken, success: true });
    } catch (error) {
      // TODO: handle this error
      console.error(error);
      res.status(500).send();
    }
  }

  async loginUser(req: Request, res: Response) {
    const dto = Object.assign(new LoginUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length) {
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
      res.status(200).json({ success: true, user });
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

    try {
      const user = await this.userService.getByEmail(email);
      if (user) {
        const resetURL = `http://localhost:5173/reset-password?token=${token}`;
        PostmarkSender.instance.send(
          user.fullName,
          user.email,
          resetURL,
          "forget-password"
        );
      }
      res.status(200).json({
        success: true,
        message: "AN email was sent with password recovery instruction.",
      });
    } catch (error: Error | any) {
      // TODO: handle the error later on.
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { oldPassword, password, email, tokenType } = req.body;

    const dto = Object.assign(new LoginUserDto(), {
      email: req.body.email,
      password: req.body.password,
    });
    const errors = await validate(dto);
    if (errors.length) {
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
