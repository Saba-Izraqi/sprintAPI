import { injectable } from "tsyringe";
import { IProjectMemberRepo } from "../../../domain/IRepos/IProjectMemberRepo";
import { AppDataSource } from "../data-source";
import { ProjectMember } from "../../../domain/entities";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
} from "../../../domain/DTOs/projectMemberDTO";
import { getDBError } from "../utils/handleDBErrors";
import { UserError } from "../../../app/exceptions";

@injectable()
export class ProjectMemberRepo implements IProjectMemberRepo {
  private _projectMemberRepo;

  constructor() {
    this._projectMemberRepo = AppDataSource.getRepository(ProjectMember);
  }

  async add(dto: CreateProjectMemberDto): Promise<ProjectMember> {
    try {
      const member = this._projectMemberRepo.create(dto);
      return await this._projectMemberRepo.save(member);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async updatePermission(
    memberId: string,
    dto: UpdateProjectMemberDto
  ): Promise<ProjectMember> {
    try {
      await this._projectMemberRepo.update(memberId, dto);
      const updated = await this._projectMemberRepo.findOne({
        where: { id: memberId },
        relations: ["user", "project"],
      });
      if (!updated) {
        throw new UserError(["Project member not found"], 404);
      }
      return updated;
    } catch (error) {
      throw getDBError(error);
    }
  }

  async remove(memberId: string): Promise<void> {
    try {
      const result = await this._projectMemberRepo.delete(memberId);

      if (!result.affected) {
        throw new UserError(["Project member not found"], 404);
      }
    } catch (error) {
      throw getDBError(error);
    }
  }

  async findByProject(projectId: string): Promise<ProjectMember[]> {
    try {
      return await this._projectMemberRepo.find({
        where: { project: { id: projectId } },
        relations: ["user", "project"],
      });
    } catch (error) {
      throw getDBError(error);
    }
  }
}
