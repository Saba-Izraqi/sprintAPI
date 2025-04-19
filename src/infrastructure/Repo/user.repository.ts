import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/IRepos/user.Repo";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "../../domain/Dto/User.Dto";

export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(user: CreateUserDto): Promise<UserResponseDto> {
    const newUser = this.repository.create(user);
    await this.repository.save(newUser);
    return this.toResponseDto(newUser);
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.repository.findOneBy({ id });
    return user ? this.toResponseDto(user) : null;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.repository.findOneBy({ email });
    return user ? this.toResponseDto(user) : null;
  }

  async update(id: string, updates: UpdateUserDto): Promise<UserResponseDto | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.find();
    return users.map(this.toResponseDto);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}