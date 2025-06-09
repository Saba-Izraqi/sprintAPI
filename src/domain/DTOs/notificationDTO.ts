import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsBoolean, IsObject, IsUrl, IsDateString } from "class-validator";
import { NotificationType, NotificationPriority } from "../entities/notification.entity";

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsUUID()
  recipientId!: string;

  @IsUUID()
  @IsOptional()
  senderId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsUrl()
  @IsOptional()
  actionUrl?: string;

  @IsBoolean()
  @IsOptional()
  emailSent?: boolean;

  @IsDateString()
  @IsOptional()
  scheduledFor?: Date;
}

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  emailSent?: boolean;
}

export class NotificationResponseDto {
  id!: string;
  title!: string;
  message!: string;
  type!: NotificationType;
  priority!: NotificationPriority;
  recipientId!: string;
  senderId?: string;
  isRead!: boolean;
  metadata?: Record<string, any>;
  actionUrl?: string;
  emailSent!: boolean;
  scheduledFor?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class NotificationQueryDto {
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
