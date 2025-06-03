// src/app/services/user.service.ts
import { injectable, inject } from "tsyringe";
import { IUserRepo } from "../../domain/IRepos/IUserRepo";
import bcrypt from "bcrypt";
import {
  LoginUserDto,
  RegisterUserDto,
  UserResponseDto,
  UpdateProfileDto,
} from "../../domain/DTOs/userDTO";
import { UserError } from "../exceptions";
@injectable()
export class UserService {
  constructor(@inject("IUserRepo") private userRepo: IUserRepo) {}

  async registerUser(dto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.createUser({
      ...dto,
      password: hashedPassword,
    });
    return new UserResponseDto(user);
  }

  async loginUser(dto: LoginUserDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    const isValid = user && (await bcrypt.compare(dto.password, user.password));

    if (!isValid) {
      throw new UserError(["Invalid email or password"], 401);
    }
    return new UserResponseDto(user);
  }

  async updateEmailVerification(email: string, isVerified: boolean = true) {
    const user = await this.userRepo.updateEmailVerification(email, isVerified);
    if (!user || !user.isEmailVerified) {
      throw new UserError(["Email verification failed"], 400);
    }
    return new UserResponseDto(user);
  }

  /**
   * Update and recovery password by user email
   * @param email
   * @param newPassword
   * @param oldPassword - pass it only when the user is logged in and wants to change their password
   */

  async resetPassword(
    email: string,
    newPassword: string,
    oldPassword?: string
  ) {
    if (oldPassword) {
      const user = await this.userRepo.findByEmail(email);
      const isValid =
        user && (await bcrypt.compare(oldPassword, user.password));
      if (!isValid) {
        throw new UserError(["Invalid current password"], 401);
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePassword(email, hashedPassword);
    return;
  }
  async getByEmail(email: string) {
    return await this.userRepo.findByEmail(email);
  }

  async updateProfile(
    userId: string, 
    profileData: UpdateProfileDto, 
    fileBuffer?: Buffer, 
    fileName?: string
  ) {
    try {
      const updatedUser = await this.userRepo.updateProfile(userId, profileData, fileBuffer, fileName);
      return new UserResponseDto(updatedUser);
    } catch (error) {
      console.error('Error in updateProfile service:', error);
      throw error;
    }
  }

  async getById(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserError([`User with id ${userId} not found`], 404);
    }
    return new UserResponseDto(user);
  }
}
