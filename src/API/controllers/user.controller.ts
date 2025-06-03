import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../app/services/user.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { RegisterUserDto, LoginUserDto, UpdateProfileDto } from "../../domain/DTOs/userDTO";
import { Token } from "../enums/token";
import { genToken } from "../utils/token";
import PostmarkSender from "../../infrastructure/email/postmarkSender";
import { UserError } from "../../app/exceptions";
import multer from "multer";
import "../types"; // Import types to extend Express Request
import { validateProfilePhoto } from "../../utils/file-validation";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(RegisterUserDto, req.body);
    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
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
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(LoginUserDto, req.body);
    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }

      const user = await this.userService.loginUser(dto);
      const token = genToken({
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        tokenType: Token.ACCESS,
      });
      res.status(200).json({ user, token, success: true });
    } catch (error) {
      next(error);
    }
  }
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    try {
      const user = await this.userService.updateEmailVerification(email, true);
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { oldPassword, password, email, tokenType } = req.body;

    const dto = plainToInstance(LoginUserDto, {
      email: req.body.email,
      password: req.body.password,
    });
    try {
      const errors = await validate(dto);
      if (errors.length) {
        console.error(errors);
        throw new UserError(errors);
      }
      await this.userService.resetPassword(
        email,
        password,
        tokenType === Token.ACCESS ? oldPassword : null
      );
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user ID from the authenticated user (JWT token)
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: "Unauthorized: User ID not found" });
        return;
      }

      // Extract profile data from request body
      const profileData = {
        fullName: req.body.fullName
      };
      
      let fileBuffer: Buffer | undefined;
      let fileName: string | undefined;
      
      // Handle file upload if present
      if (req.file) {
        // Validate the uploaded file
        const validation = validateProfilePhoto(req.file);
        
        if (!validation.valid) {
          res.status(400).json({ 
            success: false, 
            message: validation.error || "Invalid file" 
          });
          return;
        }
        
        fileBuffer = req.file.buffer;
        fileName = req.file.originalname;
      }
      
      // Update profile in service
      const updatedUser = await this.userService.updateProfile(
        userId,
        profileData,
        fileBuffer,
        fileName
      );
      
      res.status(200).json({ 
        success: true, 
        message: "Profile updated successfully", 
        user: updatedUser 
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user ID from the authenticated user (JWT token)
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: "Unauthorized: User ID not found" });
        return;
      }
      
      // Get user profile from service
      const user = await this.userService.getById(userId);
      
      res.status(200).json({ 
        success: true, 
        user 
      });
    } catch (error) {
      next(error);
    }
  }
}
