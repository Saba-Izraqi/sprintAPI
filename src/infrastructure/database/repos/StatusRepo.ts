import { injectable } from "tsyringe";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Status } from "../../../domain/entities/status.entity";
import { IStatusRepo } from "../../../domain/IRepos/IStatusRepo";
import { CreateStatusDto, UpdateStatusDto } from "../../../domain/DTOs/statusDTO";

@injectable()
export class StatusRepo implements IStatusRepo {
  private statusRepository;

  constructor() {
    this.statusRepository = AppDataSource.getRepository(Status);
  }

  async create(statusData: CreateStatusDto): Promise<Status> {
    const status = this.statusRepository.create({
      name: statusData.name,
      type: statusData.type,
      ...(statusData.columnId && { column: { id: statusData.columnId } })
    });
    return this.statusRepository.save(status);
  }

  async findById(id: string): Promise<Status | null> {
    return this.statusRepository.findOne({
      where: { id },
      relations: ['column']
    });
  }

  async findAll(): Promise<Status[]> {
    return this.statusRepository.find({ relations: ['column'] });
  }

  async findByColumn(columnId: string): Promise<Status[]> {
    return this.statusRepository.find({
      where: { column: { id: columnId } },
      relations: ['column']
    });
  }

  async update(id: string, updateData: UpdateStatusDto): Promise<Status> {
    const updatePayload: any = {
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.type && { type: updateData.type }),
    };

    if ('columnId' in updateData) {
      updatePayload.column = updateData.columnId ? { id: updateData.columnId } : null;
    }

    await this.statusRepository.update(id, updatePayload);
    const updatedStatus = await this.findById(id);
    if (!updatedStatus) throw new Error("Status not found after update");
    return updatedStatus;
  }

  async delete(id: string): Promise<void> {
    await this.statusRepository.delete(id);
  }
}