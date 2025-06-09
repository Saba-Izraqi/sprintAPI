import { 
  sendNotification, 
  sendNotificationToUsers, 
  sendProjectNotification 
} from "../app/services/notification.service";
import { NotificationType, NotificationPriority } from "../domain/entities/notification.entity";

/**
 * Example usage of the notification system
 * These functions can be called from anywhere in your application
 */

// Example 1: Send a simple notification when an issue is assigned
export async function notifyIssueAssigned(assigneeId: string, issueKey: string, assignerId: string) {
  await sendNotification({
    title: "New Issue Assigned",
    message: `You have been assigned to issue ${issueKey}`,
    type: NotificationType.ISSUE_ASSIGNED,
    recipientId: assigneeId,
    senderId: assignerId,
    priority: NotificationPriority.MEDIUM,
    actionUrl: `/issues/${issueKey}`,
    metadata: {
      issueKey,
      action: "assigned"
    }
  });
}

// Example 2: Send urgent notification when sprint is started
export async function notifySprintStarted(projectId: string, memberIds: string[], sprintName: string, starterId: string) {
  await sendNotificationToUsers({
    title: "Sprint Started!",
    message: `Sprint "${sprintName}" has been started. Time to get to work!`,
    type: NotificationType.SPRINT_STARTED,
    recipientIds: memberIds,
    senderId: starterId,
    priority: NotificationPriority.HIGH,
    actionUrl: `/projects/${projectId}/sprints`,
    metadata: {
      projectId,
      sprintName,
      action: "started"
    }
  });
}

// Example 3: Send project-wide notification
export async function notifyProjectUpdate(projectId: string, memberIds: string[], updateMessage: string, updaterId: string) {
  await sendProjectNotification({
    title: "Project Update",
    message: updateMessage,
    type: NotificationType.PROJECT_UPDATED,
    projectId,
    memberIds,
    senderId: updaterId,
    priority: NotificationPriority.MEDIUM,
    actionUrl: `/projects/${projectId}`
  });
}

// Example 4: Send invitation notification with high priority
export async function notifyProjectInvitation(inviteeId: string, projectName: string, inviterId: string, projectId: string) {
  await sendNotification({
    title: "Project Invitation",
    message: `You have been invited to join project "${projectName}"`,
    type: NotificationType.PROJECT_INVITATION,
    recipientId: inviteeId,
    senderId: inviterId,
    priority: NotificationPriority.HIGH, // This will trigger email
    actionUrl: `/projects/${projectId}/invite`,
    metadata: {
      projectId,
      projectName,
      action: "invitation"
    }
  });
}

// Example 5: Send scheduled notification
export async function scheduleSprintEndReminder(memberIds: string[], sprintName: string, endDate: Date, projectId: string) {
  const reminderDate = new Date(endDate);
  reminderDate.setDate(reminderDate.getDate() - 1); // 1 day before sprint ends

  for (const memberId of memberIds) {
    await sendNotification({
      title: "Sprint Ending Soon",
      message: `Sprint "${sprintName}" will end tomorrow. Make sure to complete your tasks!`,
      type: NotificationType.SPRINT_COMPLETED,
      recipientId: memberId,
      priority: NotificationPriority.MEDIUM,
      scheduleFor: reminderDate,
      actionUrl: `/projects/${projectId}/sprints`,
      metadata: {
        projectId,
        sprintName,
        endDate: endDate.toISOString(),
        action: "reminder"
      }
    });
  }
}

// Example 6: Send comment notification with metadata
export async function notifyCommentAdded(issueAssigneeId: string, issueKey: string, commenterId: string, commentText: string) {
  await sendNotification({
    title: "New Comment",
    message: `${commentText.substring(0, 100)}${commentText.length > 100 ? '...' : ''}`,
    type: NotificationType.COMMENT_ADDED,
    recipientId: issueAssigneeId,
    senderId: commenterId,
    priority: NotificationPriority.LOW,
    actionUrl: `/issues/${issueKey}#comments`,
    metadata: {
      issueKey,
      commentLength: commentText.length,
      action: "comment_added"
    }
  });
}
