import { inject, injectable } from "tsyringe";
import { plainToInstance } from "class-transformer"; // Added import
import { IRelatedIssueRepo } from "../../domain/IRepos/IRelatedIssueRepo";
import { CreateRelatedIssueDto, RelatedIssueResponseDto } from "../../domain/DTOs/relatedIssueDTO";
import { RelatedIssue } from "../../domain/entities/related-issue.entity";
import { BadRequestException, NotFoundException, ServerError, ConflictException } from "../exceptions/ServerExceptions"; 
import { IIssueRepo } from "../../domain/IRepos/IIssueRepo";
import { RelatedIssueType } from "../../domain/enums/types";

@injectable()
export class RelatedIssueService {
  constructor(
    @inject("IRelatedIssueRepo") private relatedIssueRepo: IRelatedIssueRepo,
    @inject("IIssueRepo") private issueRepo: IIssueRepo
  ) {}

  async create(createDto: CreateRelatedIssueDto): Promise<RelatedIssueResponseDto> { // Renamed from createRelatedIssue
    if (createDto.issueId === createDto.relatedIssueId) {
      throw new BadRequestException("An issue cannot be related to itself.");
    }

    const [issue1, issue2] = await Promise.all([
      this.issueRepo.getById(createDto.issueId),
      this.issueRepo.getById(createDto.relatedIssueId),
    ]);

    if (!issue1) {
      throw new NotFoundException(`Issue with ID ${createDto.issueId} not found.`);
    }
    if (!issue2) {
      throw new NotFoundException(`Issue with ID ${createDto.relatedIssueId} not found.`);
    }

    const existingRelation = await this.relatedIssueRepo.findByIds(createDto.issueId, createDto.relatedIssueId);
    if (existingRelation) {
      throw new ConflictException("These issues are already related.");
    }

    
    const createdInternalEntity = await this.relatedIssueRepo.create(createDto); 
     const newRelation = await this.relatedIssueRepo.findById_withRelations(createdInternalEntity.id);
    if (!newRelation) {
        throw new ServerError("Failed to retrieve relation after creation.", 500);
    }
      const responseDto = plainToInstance(RelatedIssueResponseDto, {
        ...newRelation,
        issueId: newRelation.sourceIssue.id, // Explicit mapping
        relatedIssueId: newRelation.targetIssue.id // Explicit mapping
    }, { excludeExtraneousValues: true });
    return responseDto;
  }

  async getAllByIssueId(issueId: string): Promise<RelatedIssueResponseDto[]> { // Renamed from getRelatedIssues
    const issue = await this.issueRepo.getById(issueId);
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${issueId} not found.`);
    }
    const relatedIssues = await this.relatedIssueRepo.findByIssueId(issueId);
    return relatedIssues.map(rel => plainToInstance(RelatedIssueResponseDto, {
        ...rel,
        issueId: rel.sourceIssue.id,
        relatedIssueId: rel.targetIssue.id
    }, { excludeExtraneousValues: true }));
  }

  async getById(id: string): Promise<RelatedIssueResponseDto> { // Renamed from getRelatedIssueLinkById
    const relatedIssue = await this.relatedIssueRepo.findById_withRelations(id);
    if (!relatedIssue) {
      throw new NotFoundException(`Related issue link with ID ${id} not found.`);
    }
    return plainToInstance(RelatedIssueResponseDto, {
        ...relatedIssue,
        issueId: relatedIssue.sourceIssue.id,
        relatedIssueId: relatedIssue.targetIssue.id
    }, { excludeExtraneousValues: true });
  }

  async update(id: string, type: RelatedIssueType): Promise<RelatedIssueResponseDto | null> { // Renamed from updateRelatedIssue
    const updatedInternalEntity = await this.relatedIssueRepo.update(id, type);
    if (!updatedInternalEntity) {
      throw new NotFoundException(`Related issue link with ID ${id} not found.`);
    }
    const fullUpdatedRelation = await this.relatedIssueRepo.findById_withRelations(id);
    if (!fullUpdatedRelation) {
        throw new ServerError("Failed to retrieve updated relation.", 500); 
    }
    return plainToInstance(RelatedIssueResponseDto, {
        ...fullUpdatedRelation,
        issueId: fullUpdatedRelation.sourceIssue.id,
        relatedIssueId: fullUpdatedRelation.targetIssue.id
    }, { excludeExtraneousValues: true });
  }

  async deleteById(id: string): Promise<boolean> { // Renamed from deleteRelatedIssue
    const success = await this.relatedIssueRepo.delete(id);
    if (!success) {
      throw new NotFoundException(`Related issue link with ID ${id} not found for deletion.`);
    }
    return success;
  }

  async deleteByIssueIds(issueId: string, relatedIssueId: string): Promise<boolean> { // Renamed from deleteRelatedIssueByIds
    const issue1 = await this.issueRepo.getById(issueId); 
    if (!issue1) {
      throw new NotFoundException(`Issue with ID ${issueId} not found.`);
    }
    const issue2 = await this.issueRepo.getById(relatedIssueId); 
    if (!issue2) {
      throw new NotFoundException(`Issue with ID ${relatedIssueId} not found.`);
    }

    const success = await this.relatedIssueRepo.deleteByIds(issueId, relatedIssueId);
    if (!success) {
      throw new NotFoundException(`No relation found between issue ${issueId} and ${relatedIssueId} to delete.`);
    }
    return success;
  }
}
