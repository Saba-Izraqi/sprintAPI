// src/infrastructure/database/repos/UserRepo.ts
import { injectable } from "tsyringe";
import { User } from "../../../domain/entities/user.entity";
import { IUserRepo } from "../../../domain/IRepos/IUserRepo";
import { AppDataSource } from "../data-source";

@injectable()
export class UserRepo implements IUserRepo {
  private _userRepo;

  constructor() {
    this._userRepo = AppDataSource.getRepository(User);
  }

  createUser(user: any) {
    console.debug('hello from repo');
    return null //this._userRepo.create(user)?.[0];
  }
}
