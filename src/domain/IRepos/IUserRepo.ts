import { RegisterUserDto } from "../DTOs/userDTO";
import { User } from "../entities";

export interface IUserRepo {
  create(user: RegisterUserDto): any;
  findByEmail(email: string): Promise<any>;
  updateEmailVerification(
    email: string,
    isEmailVerified: boolean,
  ): Promise<User>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}
