import { injectable, inject, container } from "tsyringe";
import { INotificationRepo } from "../../domain/IRepos/INotificationRepo";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationQueryDto,
} from "../../domain/DTOs/notificationDTO";
import {
  Notification,
  NotificationType,
  NotificationPriority,
} from "../../domain/entities/notification.entity";
import { SocketService } from "../../infrastructure/socket/socket.service";
import PostmarkSender from "../../infrastructure/email/postmarkSender";

/**
 * Service for managing notifications with real-time delivery and email integration
 */
@injectable()
export class NotificationService {
  /**
   * Constructor for NotificationService
   * @param notificationRepo - Repository for notification operations
   */
  constructor(
    @inject("INotificationRepo") private notificationRepo: INotificationRepo
  ) {}

  /**
   * Create a new notification
   * @param dto - The notification data transfer object
   * @returns Promise<Notification> - The created notification
   */
  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notificationRepo.create(dto);

    // Send real-time notification via Socket.IO
    await this.sendRealTimeNotification(notification);

    // Send email if required and not already sent
    if (!dto.emailSent && this.shouldSendEmail(notification)) {
      await this.sendEmailNotification(notification);
    }

    return notification;
  }

  /**
   * Find a notification by ID
   * @param id - The notification ID
   * @returns Promise<Notification | null> - The notification or null if not found
   */
  async findById(id: string): Promise<Notification | null> {
    return this.notificationRepo.findById(id);
  }

  /**
   * Find notifications by recipient ID
   * @param recipientId - The recipient user ID
   * @param query - Optional query parameters for filtering
   * @returns Promise<Notification[]> - Array of notifications
   */
  async findByRecipientId(
    recipientId: string,
    query?: NotificationQueryDto
  ): Promise<Notification[]> {
    return this.notificationRepo.findByRecipientId(recipientId, query);
  }

  /**
   * Update a notification
   * @param id - The notification ID
   * @param dto - Update data transfer object
   * @returns Promise<Notification> - The updated notification
   */
  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationRepo.update(id, dto);
  }

  /**
   * Delete a notification
   * @param id - The notification ID
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    return this.notificationRepo.delete(id);
  }

  /**
   * Mark a notification as read
   * @param id - The notification ID
   * @returns Promise<Notification> - The updated notification
   */
  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepo.markAsRead(id);

    // Emit real-time update
    const socketService = container.resolve(SocketService);
    socketService.emitToUser(notification.recipientId, "notification:read", {
      notificationId: id,
      unreadCount: await this.getUnreadCount(notification.recipientId),
    });

    return notification;
  }

  /**
   * Mark all notifications as read for a user
   * @param recipientId - The recipient user ID
   * @returns Promise<void>
   */
  async markAllAsRead(recipientId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(recipientId);

    // Emit real-time update
    const socketService = container.resolve(SocketService);
    socketService.emitToUser(recipientId, "notifications:all-read", {
      unreadCount: 0,
    });
  }

  /**
   * Get unread notification count for a user
   * @param recipientId - The recipient user ID
   * @returns Promise<number> - The count of unread notifications
   */
  async getUnreadCount(recipientId: string): Promise<number> {
    return this.notificationRepo.getUnreadCount(recipientId);
  }

  /**
   * Send real-time notification via Socket.IO
   * @param notification - The notification to send
   * @returns Promise<void>
   */
  private async sendRealTimeNotification(
    notification: Notification
  ): Promise<void> {
    try {
      const socketService = container.resolve(SocketService);

      // Get updated unread count
      const unreadCount = await this.getUnreadCount(notification.recipientId);

      // Send notification to user
      socketService.emitToUser(notification.recipientId, "notification:new", {
        notification: {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          metadata: notification.metadata,
          actionUrl: notification.actionUrl,
          createdAt: notification.createdAt,
        },
        unreadCount,
      });
    } catch (error) {
      console.error("Failed to send real-time notification:", error);
    }
  }

  /**
   * Check if email should be sent for a notification
   * @param notification - The notification to check
   * @returns boolean - Whether email should be sent
   */
  private shouldSendEmail(notification: Notification): boolean {
    // Send email for high priority or urgent notifications
    return (
      notification.priority === NotificationPriority.HIGH ||
      notification.priority === NotificationPriority.URGENT ||
      notification.type === NotificationType.PROJECT_INVITATION
    );
  }

  /**
   * Send email notification
   * @param notification - The notification to send via email
   * @returns Promise<void>
   */
  private async sendEmailNotification(
    notification: Notification
  ): Promise<void> {
    try {
      const emailSender = PostmarkSender.instance;

      if (notification.recipient?.email) {
        // Use the existing send method with template
        await emailSender.send(
          notification.recipient.fullName || notification.recipient.email,
          notification.recipient.email,
          notification.actionUrl || "#",
          "notification" // You'll need to create this template in Postmark
        );

        // Mark email as sent
        await this.notificationRepo.update(notification.id, {
          emailSent: true,
        });
      }
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  }

  /**
   * Generate HTML content for email notifications
   * @param notification - The notification to generate HTML for
   * @returns string - The HTML content
   */
  private generateEmailHTML(notification: Notification): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${notification.title}</h2>
        <p style="color: #666; line-height: 1.6;">${notification.message}</p>
        ${
          notification.actionUrl
            ? `
          <div style="margin: 20px 0;">
            <a href="${notification.actionUrl}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Details
            </a>
          </div>
        `
            : ""
        }
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated notification from Sprintify. Please do not reply to this email.
        </p>
      </div>
    `;
  }
}

/**
 * Send a notification to a single user
 * @param params - Notification parameters
 * @returns Promise<Notification> - The created notification
 */
export async function sendNotification(params: {
  title: string;
  message: string;
  type: NotificationType;
  recipientId: string;
  senderId?: string;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
  scheduleFor?: Date;
}): Promise<Notification> {
  const notificationService = container.resolve(NotificationService);

  const dto: CreateNotificationDto = {
    title: params.title,
    message: params.message,
    type: params.type,
    recipientId: params.recipientId,
    senderId: params.senderId,
    priority: params.priority || NotificationPriority.MEDIUM,
    metadata: params.metadata,
    actionUrl: params.actionUrl,
    scheduledFor: params.scheduleFor,
  };

  return notificationService.create(dto);
}

/**
 * Send notifications to multiple users
 * @param params - Notification parameters with multiple recipients
 * @returns Promise<Notification[]> - Array of created notifications
 */
export async function sendNotificationToUsers(params: {
  title: string;
  message: string;
  type: NotificationType;
  recipientIds: string[];
  senderId?: string;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
}): Promise<Notification[]> {
  const promises = params.recipientIds.map((recipientId) =>
    sendNotification({
      ...params,
      recipientId,
    })
  );

  return Promise.all(promises);
}

/**
 * Send notification to all members of a project
 * @param params - Project notification parameters
 * @returns Promise<void>
 */
export async function sendProjectNotification(params: {
  title: string;
  message: string;
  type: NotificationType;
  projectId: string;
  memberIds: string[];
  senderId?: string;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
}): Promise<void> {
  // Send to all project members
  await sendNotificationToUsers({
    title: params.title,
    message: params.message,
    type: params.type,
    recipientIds: params.memberIds,
    senderId: params.senderId,
    priority: params.priority,
    metadata: { ...params.metadata, projectId: params.projectId },
    actionUrl: params.actionUrl,
  });

  // Send real-time notification to project room
  const socketService = container.resolve(SocketService);
  socketService.emitToProject(params.projectId, "project:notification", {
    title: params.title,
    message: params.message,
    type: params.type,
    metadata: params.metadata,
  });
}