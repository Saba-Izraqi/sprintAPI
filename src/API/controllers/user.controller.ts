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

  /**
   * @swagger
   * /api/v1/user/register:
   *   post:
   *     tags:
   *       - User
   *     summary: Register a new user
   *     description: Creates a new user account and sends email verification
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterUserDto'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/UserResponseDto'
   *                 token:
   *                   type: string
   *                 emailVerificationToken:
   *                   type: string
   *                 success:
   *                   type: boolean
   *       400:
   *         description: Validation error
   */
  async register(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(RegisterUserDto, req.body);
    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }
      const user = await this.userService.register(dto);
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

  /**
   * @swagger
   * /api/v1/user/login:
   *   post:
   *     tags:
   *       - User
   *     summary: User login
   *     description: Authenticate user with email and password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginUserDto'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/UserResponseDto'
   *                 token:
   *                   type: string
   *                 success:
   *                   type: boolean
   *       401:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(LoginUserDto, req.body);
    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }

      const user = await this.userService.login(dto);
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
  /**
   * @swagger
   * /api/v1/user/verify-email:
   *   post:
   *     tags:
   *       - User
   *     summary: Verify user email
   *     description: Verify user's email address using verification token
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Email verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 user:
   *                   $ref: '#/components/schemas/UserResponseDto'
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    try {
      const user = await this.userService.updateEmailVerification(email, true);
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/user/forget-password:
   *   post:
   *     tags:
   *       - User
   *     summary: Request password reset
   *     description: Send password reset email to user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Password reset email sent
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   */
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

  /**
   * @swagger
   * /api/v1/user/password-reset:
   *   post:
   *     tags:
   *       - User
   *     summary: Reset password
   *     description: Reset user password using reset token
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *               oldPassword:
   *                 type: string
   *               tokenType:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password reset successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   */
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
  /**
   * @swagger
   * /api/v1/user/update-profile:
   *   put:
   *     tags:
   *       - User
   *     summary: Update user profile
   *     description: Update user profile information including profile photo
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               fullName:
   *                 type: string
   *               profilePhoto:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 user:
   *                   $ref: '#/components/schemas/UserResponseDto'
   *       401:
   *         description: Unauthorized
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user ID from the authenticated user (JWT token)
      const userId = (req as any).user?.id;
      
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

  /**
   * @swagger
   * /api/v1/user/profile:
   *   get:
   *     tags:
   *       - User
   *     summary: Get user profile
   *     description: Retrieve the authenticated user's profile information
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 user:
   *                   $ref: '#/components/schemas/UserResponseDto'
   *       401:
   *         description: Unauthorized
   */  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user ID from the authenticated user (JWT token)
      const userId = (req as any).user?.id;
      
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