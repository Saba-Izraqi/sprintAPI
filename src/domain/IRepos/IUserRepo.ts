// src/domain/IRepos/IUserRepo.ts
import { RegisterUserDto } from "../DTOs/userDTO";

export interface IUserRepo {
  createUser(user: RegisterUserDto): any;
  findByEmail(email: string): Promise<any>;
}

