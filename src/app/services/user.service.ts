// src/app/services/user.service.ts
import { injectable, inject } from "tsyringe";
import { IUserRepo } from "../../domain/IRepos/IUserRepo";

@injectable()
export class UserService {
  constructor(
    @inject("IUserRepo") private userRepo: IUserRepo
  ) {}

  async createUser(user: any) {
    console.debug('hello from service')
    return this.userRepo.createUser(user);
  }
}
