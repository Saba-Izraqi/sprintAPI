// src/domain/IRepos/IUserRepo.ts
import { RegisterUserDto } from "../DTOs/userDTO";
import { User } from "../entities/user.entity";

export interface IUserRepo {
  createUser(user: RegisterUserDto): any;
  findByEmail(email: string): Promise<any>;
  updateEmailVerification(email: string, isEmailVerified: boolean): Promise<User>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}

