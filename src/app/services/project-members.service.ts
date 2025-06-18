import { inject, injectable } from "tsyringe";
import { IProjectMemberRepo } from "../../domain/IRepos/IProjectMemberRepo";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
} from "../../domain/DTOs/projectMemberDTO";
import { NotificationService } from "./notification.service";
import { SendNotificationToUsersDto } from "../../domain/DTOs/notificationDTO";
import { NotificationType } from "../../domain/types";

@injectable()
export class ProjectMembersService {
  constructor(
    @inject("IProjectMemberRepo") private repo: IProjectMemberRepo,
    @inject(NotificationService) private notification: NotificationService
  ) {}

  async add(newMembership: CreateProjectMemberDto) {
    const newMember = await this.repo.add(newMembership);
    const notificationObj: SendNotificationToUsersDto = {
      title: "New Member Added 🎉",
      message: `Let's welcome our new member ${newMember.user.fullName} to the project!`,
      type: NotificationType.PROJECT_INVITATION,
      recipientIds: [],
    };
    this.notification.sendNotificationToUsers(
      notificationObj,
      (await newMember).projectId
    );
    return newMember;
  }

  async update(membership: UpdateProjectMemberDto) {
    return this.repo.update(membership);
  }

  async remove(membershipId: string): Promise<void> {
    await this.repo.remove(membershipId);
  }

  async find(where: Partial<CreateProjectMemberDto>) {
    return this.repo.find(where);
  }
}
