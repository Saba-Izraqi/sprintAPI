import { injectable } from "tsyringe";
import { IProjectRepo } from "../../../domain/IRepos/IProjectRepo";
import { Project } from "../../../domain/entities";
import { AppDataSource } from "../data-source";
import { getDBError } from "../utils/handleDBErrors";
import {
  CreateProjectDto,
  UpdateProjectDTO,
} from "../../../domain/DTOs/projectDTO";
@injectable()
export class ProjectRepo implements IProjectRepo {
  private _projectRepo;

  constructor() {
    this._projectRepo = AppDataSource.getRepository(Project);
  }

  async create(project: CreateProjectDto): Promise<Project> {
    try {
      const newProject = this._projectRepo.create(project);
      return await this._projectRepo.save(newProject);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async update(project: UpdateProjectDTO): Promise<Project> {
    try {
      return await this._projectRepo.save(project);
    } catch (error) {
      throw getDBError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this._projectRepo.delete(id);
    } catch (error) {
      throw getDBError(error);
    }
  }
  async getByKeyPrefix(keyPrefix: string): Promise<Project | null> {
    try {
      return await this._projectRepo.findOne({ where: { keyPrefix } });
    } catch (error) {
      throw getDBError(error);
    }
  }
  async getByName(name: string): Promise<Project[]> {
    try {
      return await this._projectRepo.find({ where: { name } });
    } catch (error) {
      throw getDBError(error);
    }
  }
  async getByUserId(userId: string): Promise<Project[]> {
    try {
      return await this._projectRepo
        .createQueryBuilder("project")
        .innerJoin("project.members", "member")
        .innerJoin("member.user", "user")
        .where("user.id = :userId", { userId })
        .getMany();
    } catch (error) {
      throw getDBError(error);
    }
  }
}
