import { RegisterUserDto, UpdateProfileDto } from "../DTOs/userDTO";
import { User } from "../entities";

export interface IUserRepo {
  create(user: RegisterUserDto): any;
  findByEmail(email: string): Promise<any>;
  findAll(): Promise<User[]>;
  updateEmailVerification(
    email: string,
    isEmailVerified: boolean,
  ): Promise<User>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  findById(id: string): Promise<User | null>;
  updateProfile(
    userId: string,
    profileData: UpdateProfileDto,
    fileBuffer?: Buffer,
    fileName?: string
  ): Promise<User>;
}
