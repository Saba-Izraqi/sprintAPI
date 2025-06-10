import { injectable } from "tsyringe";
import { IProjectMemberRepo } from "../../domain/IRepos/IProjectMemberRepo";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
} from "../../domain/DTOs/projectMemberDTO";

@injectable()
export class ProjectMembersService {
  constructor(private repo: IProjectMemberRepo) {}

  async add(newMembership: CreateProjectMemberDto) {
    return this.repo.add(newMembership); // TODO: Fire notification
  }

  async update(membership: UpdateProjectMemberDto) {
    this.repo.update(membership); // TODO: Fire notification but check with saba before
  }
}
