import { AppDataSource } from "../data-source";
import { RelatedIssue } from "../../../domain/entities/related-issue.entity";
import { CreateRelatedIssueDto } from "../../../domain/DTOs/relatedIssueDTO";
import { IRelatedIssueRepo } from "../../../domain/IRepos/IRelatedIssueRepo";
import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { RelatedIssueType } from "../../../domain/enums/types";

@injectable()
export class RelatedIssueRepo implements IRelatedIssueRepo {
  private relatedIssueRepository: Repository<RelatedIssue>;

  constructor() {
    this.relatedIssueRepository = AppDataSource.getRepository(RelatedIssue);
  }

  async create(createRelatedIssueDto: CreateRelatedIssueDto): Promise<RelatedIssue> {
    const newRelatedIssue = this.relatedIssueRepository.create({
      sourceIssue: { id: createRelatedIssueDto.issueId }, // Link to existing Issue entity
      targetIssue: { id: createRelatedIssueDto.relatedIssueId }, // Link to existing Issue entity
      type: createRelatedIssueDto.type,
    });
    return await this.relatedIssueRepository.save(newRelatedIssue);
  }

  async findByIds(issueId: string, relatedIssueId: string): Promise<RelatedIssue | null> {
    return await this.relatedIssueRepository.findOne({
      where: [
        { sourceIssue: { id: issueId }, targetIssue: { id: relatedIssueId } },
        { sourceIssue: { id: relatedIssueId }, targetIssue: { id: issueId } } 
      ],
      relations: ["sourceIssue", "targetIssue"],
    });
  }

  async findByIssueId(issueId: string): Promise<RelatedIssue[]> {
    return await this.relatedIssueRepository.find({
      where: [
        { sourceIssue: { id: issueId } },
        { targetIssue: { id: issueId } }
      ],
      relations: ["sourceIssue", "targetIssue", "sourceIssue.project", "targetIssue.project"]
    });
  }

  async findById_withRelations(id: string): Promise<RelatedIssue | null> {
    return await this.relatedIssueRepository.findOne({
      where: { id },
      relations: ["sourceIssue", "targetIssue"],
    });
  }

  async update(id: string, relationshipType: RelatedIssueType): Promise<RelatedIssue | null> {
    const relatedIssue = await this.relatedIssueRepository.findOneBy({ id });
    if (!relatedIssue) {
      return null;
    }
    relatedIssue.type = relationshipType;
    return await this.relatedIssueRepository.save(relatedIssue);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.relatedIssueRepository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async deleteByIds(issueId: string, relatedIssueId: string): Promise<boolean> {
    const relatedIssue = await this.findByIds(issueId, relatedIssueId);
    if (!relatedIssue) {
      return false;
    }
    return await this.delete(relatedIssue.id);
  }
}
