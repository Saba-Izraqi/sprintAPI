// src/app/services/user.service.ts
import { injectable, inject } from "tsyringe";
import { IUserRepo } from "../../domain/IRepos/IUserRepo";
import bcrypt from "bcrypt";
import { LoginUserDto, RegisterUserDto, UserResponseDto } from "../../domain/DTOs/userDTO";

@injectable()
export class UserService {
  constructor(
    @inject("IUserRepo") private userRepo: IUserRepo
  ) {}

  async registerUser(dto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.createUser({ ...dto, password: hashedPassword });
    return new UserResponseDto(user);
  }

  async loginUser(dto: LoginUserDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return new UserResponseDto(user);
  }

  async updateEmailVerification(email: string, isVerified: boolean = true) {
    const user = await this.userRepo.updateEmailVerification(email, isVerified);
    if (!user || !user.isEmailVerified) {
      throw new Error("Email verification failed");
    }
    return new UserResponseDto(user);
  }

  /**
   * Update and recovery password by user email
   * @param email 
   * @param newPassword
   * @param oldPassword - pass it only when the user is logged in and wants to change their password
   */
  async resetPassword(email: string, newPassword: string, oldPassword?: string) {
    if (oldPassword) {
      const user = await this.userRepo.findByEmail(email);
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error("Invalid credentials");
      }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePassword(email, hashedPassword);
    return;
  }

  async getByEmail(email: string) {
    return await this.userRepo.findByEmail(email);
  }
}
