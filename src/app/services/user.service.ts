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
}
