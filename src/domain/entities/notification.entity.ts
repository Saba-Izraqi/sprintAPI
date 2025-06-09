import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity, User } from ".";

export enum NotificationType {
  PROJECT_INVITATION = "PROJECT_INVITATION",
  ISSUE_ASSIGNED = "ISSUE_ASSIGNED",
  ISSUE_UPDATED = "ISSUE_UPDATED",
  SPRINT_STARTED = "SPRINT_STARTED",
  SPRINT_COMPLETED = "SPRINT_COMPLETED",
  COMMENT_ADDED = "COMMENT_ADDED",
  EPIC_UPDATED = "EPIC_UPDATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  GENERAL = "GENERAL",
}

export enum NotificationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

/**
 * Notification entity representing system notifications
 */
@Entity("notifications")
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({
    type: "enum",
    enum: NotificationType,
    default: NotificationType.GENERAL,
  })
  type!: NotificationType;

  @Column({
    type: "enum",
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority!: NotificationPriority;

  @Column({ type: "uuid" })
  recipientId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipientId" })
  recipient!: User;

  @Column({ type: "uuid", nullable: true })
  senderId?: string;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "senderId" })
  sender?: User;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ nullable: true })
  actionUrl?: string;

  @Column({ default: false })
  emailSent!: boolean;

  @Column({ nullable: true })
  scheduledFor?: Date;
}
