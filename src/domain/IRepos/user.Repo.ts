import { CreateUserDto, UpdateUserDto, UserResponseDto } from "../Dto/User.Dto";

export interface IUserRepository {
  create(user: CreateUserDto): Promise<UserResponseDto>;
  findById(id: string): Promise<UserResponseDto | null>;
  findByEmail(email: string): Promise<UserResponseDto | null>;
  update(id: string, updates: UpdateUserDto): Promise<UserResponseDto | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<UserResponseDto[]>;
}