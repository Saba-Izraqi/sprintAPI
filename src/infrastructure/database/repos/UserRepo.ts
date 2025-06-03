// src/infrastructure/database/repos/UserRepo.ts
import { injectable } from "tsyringe";
import { RegisterUserDto, UpdateProfileDto } from "../../../domain/DTOs/userDTO";
import { IUserRepo } from "../../../domain/IRepos/IUserRepo";
import { AppDataSource } from "../data-source";
import { User } from "../../../domain/entities/user.entity";
import { getDBError } from "../utils/handleDBErrors";
import { UserError } from "../../../app/exceptions";
import { CloudinaryService } from "../../cloudinary/CloudinaryService";

@injectable()
export class UserRepo implements IUserRepo {
  private _userRepo;

  constructor() {
    this._userRepo = AppDataSource.getRepository(User);
  }

  async createUser(user: RegisterUserDto) {
    try {
      const newUser = this._userRepo.create(user);
      return await this._userRepo.save(newUser);
    } catch (error) {
      throw getDBError(error);
    }
  }

  findByEmail(email: string) {
    return this._userRepo.findOneBy({ email });
  }
  async findById(id: string): Promise<User | null> {
    return this._userRepo.findOneBy({ id });
  }

  async updateEmailVerification(
    email: string,
    isEmailVerified: boolean
  ): Promise<User> {
    try {
      const affectedRows = (
        await this._userRepo.update({ email }, { isEmailVerified })
      ).affected;
      if (!affectedRows) {
        throw new UserError([`User with email ${email} not found.`], 404);
      }
      const updatedUser = await this._userRepo.findOneBy({ email });
      if (!updatedUser) {
        throw new UserError(
          [`User with email ${email} not found after update.`],
          404
        );
      }
      return updatedUser;
    } catch (error) {
      throw getDBError(error);
    }
  }
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      await this._userRepo.update({ id: userId }, { password: newPassword });
    } catch (error) {
      throw getDBError(error);
    }  }

  async updateProfile(
    userId: string,
    profileData: UpdateProfileDto,
    fileBuffer?: Buffer,
    fileName?: string
  ): Promise<User> {
    try {
      const updateData: Partial<User> = {};

      // Update full name if provided
      if (profileData.fullName) {
        updateData.fullName = profileData.fullName;
      }

      // Upload new profile photo if provided
      if (fileBuffer) {
        const cloudinaryService = CloudinaryService.getInstance();
        const imageUrl = await cloudinaryService.uploadProfilePhoto(fileBuffer, userId);
        updateData.image = imageUrl;
      }

      // Update user profile
      await this._userRepo.update({ id: userId }, updateData);

      // Return updated user
      const updatedUser = await this._userRepo.findOne({ where: { id: userId } });
      if (!updatedUser) {
        throw new UserError("User not found");
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw getDBError(error);
    }
  }
}
