export enum IssueType {
  BUG = "bug",
  STORY = "story",
  TASK = "task",
}
export enum StatusType {
  BACKLOG = 0,
  IN_PROGRESS = 1,
  DONE = 2,
}
export enum ProjectPermission {
  MEMBER = 0,
  MODERATOR = 1,
  ADMINISTRATOR = 2,
}

export enum NotificationType {
  PROJECT_INVITATION = "PROJECT_INVITATION",
  ISSUE_ASSIGNED = "ISSUE_ASSIGNED",
  ISSUE_UPDATED = "ISSUE_UPDATED",
  SPRINT_STARTED = "SPRINT_STARTED",
  SPRINT_COMPLETED = "SPRINT_COMPLETED",
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
