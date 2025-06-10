import { IsEmail, IsString, Length } from "class-validator";

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 255)
  password!: string;

  @IsString()
  @Length(1, 100)
  fullName!: string;
}

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 255)
  password!: string;
}

export class UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.isEmailVerified = user.isEmailVerified;
    this.image = user.image;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
