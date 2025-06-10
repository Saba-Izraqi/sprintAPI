import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../app/services/user.service";
import { RegisterUserDto, LoginUserDto } from "../../domain/DTOs/userDTO";
import { Token } from "../enums/token";
import { genToken } from "../utils/token";
import PostmarkSender from "../../infrastructure/email/postmarkSender";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}
  /**
   * @swagger
   * /api/v1/user/register:
   *   post:
   *     responses:
   *       201:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const registerUserDto = (req as any).validatedData as RegisterUserDto;
      
      const user = await this.userService.register(registerUserDto);
      const token = genToken({
        userId: user.id,
        userEmail: user.email,
        isEmailVerified: user.isEmailVerified,
      });

      const emailVerificationToken = genToken({
        userId: user.id,
        userEmail: user.email,
        isEmailVerified: user.isEmailVerified,
        tokenType: Token.EMAIL_VERIFICATION,
      });

      const emailConfirmationURL = `http://localhost:5173/verify-email?token=${emailVerificationToken}`;
      PostmarkSender.instance.send(
        user.fullName,
        user.email,
        emailConfirmationURL,
        "email-confirmation"
      );      res
        .status(201)
        .json({ 
          users: [user], 
          token, 
          emailVerificationToken 
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/user/login:
   *   post:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginUserDto = (req as any).validatedData as LoginUserDto;
      
      const user = await this.userService.login(loginUserDto);
      const token = genToken({
        userId: user.id,
        userEmail: user.email,
        isEmailVerified: user.isEmailVerified,
      });
      res.status(200).json({ 
        users: [user], 
        token 
      });
    } catch (error) {
      next(error);
    }  }

  /**
   * @swagger
   * /api/v1/user/verify-email:
   *   post:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/EmailVerificationResponse'
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.user?.userEmail;

      const user = await this.userService.updateEmailVerification(
        userEmail!,
        true
      );
      res.status(200).json({ 
        success: true, 
        users: [user] 
      });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const token = genToken({
        userEmail: email,
        userId: "unknown",
        isEmailVerified: false,
        tokenType: Token.RESET_PASSWORD,
      });

      const user = await this.userService.getByEmail(email);
      if (user) {
        const resetURL = `http://localhost:5173/reset-password?token=${token}`;
        PostmarkSender.instance.send(
          user.fullName,
          user.email,
          resetURL,
          "forget-password"
        );
      }      res.status(200).json({
        users: [],
        message:
          "AN email should be sent with password recovery instruction, token is provided in response for testing.",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldPassword, password } = req.body;
      const userEmail = req.user?.userEmail;
      const tokenType = req.user?.tokenType;

      if (tokenType === Token.ACCESS && !oldPassword) {
        res.status(400).json({
          success: false,
          message: "Old password is required. If you forget the password, press on forget password in login page."
        });
        return;
      }

      await this.userService.resetPassword(
        userEmail!,
        password,
        tokenType === Token.ACCESS ? oldPassword : null
      );      res.status(200).json({
        users: []
      });
    } catch (error) {
      next(error);
    }
  }
}
