// src/infrastructure/database/repos/UserRepo.ts
import { injectable } from "tsyringe";
import { RegisterUserDto } from "../../../domain/DTOs/userDTO";
import { IUserRepo } from "../../../domain/IRepos/IUserRepo";
import { AppDataSource } from "../data-source";
import { User } from '../../../domain/entities/user.entity';

@injectable()
export class UserRepo implements IUserRepo {
  private _userRepo;

  constructor() {
    this._userRepo = AppDataSource.getRepository(User);
  }

  createUser(user: RegisterUserDto) {
    const newUser = this._userRepo.create(user);
    return this._userRepo.save(newUser);
  }

  findByEmail(email: string) {
    return this._userRepo.findOneBy({ email });
  }

  async updateEmailVerification(email: string, isEmailVerified: boolean): Promise<User> {
    const affectedRows = (await this._userRepo.update({ email }, { isEmailVerified })).affected;
    if(!affectedRows) {
      throw new Error(`User with email ${email} not found.`);
    }
    const updatedUser = await this._userRepo.findOneBy({ email });
    if (!updatedUser) {
      throw new Error(`User with email ${email} not found after update.`);
    }
    return updatedUser;
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this._userRepo.update({ email }, { password: newPassword });
  }
}
