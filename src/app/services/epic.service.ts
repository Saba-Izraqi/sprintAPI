import { injectable, inject } from "tsyringe";
import { IEpicRepo } from "../../domain/IRepos/IEpicRepo";
import { CreateEpicDto, EpicResponseDto, UpdateEpicDto } from "../../domain/DTOs/epicDTO";
import { Epic } from "../../domain/entities";
import { UserError } from "../exceptions";

@injectable()
export class EpicService {
  constructor(@inject("IEpicRepo") private epicRepo: IEpicRepo) {}

  async getAllEpics(projectId: string): Promise<EpicResponseDto[]> {
    const epics = await this.epicRepo.findAll(projectId);
    return epics.map(epic => new EpicResponseDto(epic));
  }

  async getEpicById(id: string): Promise<EpicResponseDto> {
    const epic = await this.epicRepo.findById(id);
    if (!epic) {
      throw new UserError([`Epic with ID ${id} not found.`], 404);
    }
    return new EpicResponseDto(epic);
  }

  async getEpicByKey(key: string, projectId: string): Promise<EpicResponseDto> {
    const epic = await this.epicRepo.findByKey(key, projectId);
    if (!epic) {
      throw new UserError([`Epic with key ${key} not found in this project.`], 404);
    }
    return new EpicResponseDto(epic);
  }

  async createEpic(dto: CreateEpicDto): Promise<EpicResponseDto> {
    // Check if the key is already in use in this project
    const existingEpic = await this.epicRepo.findByKey(dto.key, dto.projectId);
    if (existingEpic) {
      throw new UserError([`Epic with key ${dto.key} already exists in this project.`], 409);
    }

    const epicData: Partial<Epic> = {
      ...dto
    };

    const newEpic = await this.epicRepo.create(epicData);
    return new EpicResponseDto(newEpic);
  }

  async updateEpic(id: string, dto: UpdateEpicDto): Promise<EpicResponseDto> {
    // Check if the epic exists
    const existingEpic = await this.epicRepo.findById(id);
    if (!existingEpic) {
      throw new UserError([`Epic with ID ${id} not found.`], 404);
    }

    const updatedEpic = await this.epicRepo.update(id, dto);
    return new EpicResponseDto(updatedEpic);
  }

  async deleteEpic(id: string): Promise<boolean> {
    const existingEpic = await this.epicRepo.findById(id);
    if (!existingEpic) {
      throw new UserError([`Epic with ID ${id} not found.`], 404);
    }

    return await this.epicRepo.delete(id);
  }
}
