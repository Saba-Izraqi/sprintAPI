export interface CreateUserDto {
    email: string;
    password: string;
    fullName: string;
    image?: string;
  }
  
  export interface UpdateUserDto {
    email?: string;
    password?: string;
    fullName?: string;
    image?: string;
  }
  
  export interface UserResponseDto {
    id: string;
    email: string;
    fullName: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  }