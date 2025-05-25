import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { RelatedIssueService } from "../../app/services/relatedIssue.service";
import { CreateRelatedIssueDto, UpdateRelatedIssueDto } from "../../domain/DTOs/relatedIssueDTO"; // Added UpdateRelatedIssueDto
import { BadRequestException } from "../../app/exceptions/ServerExceptions";
import { RelatedIssueType } from "../../domain/enums/types";

@injectable()
export class RelatedIssueController {
  constructor(
    @inject(RelatedIssueService) private relatedIssueService: RelatedIssueService
  ) {}

  
  async create(req: Request, res: Response): Promise<void> { // Renamed from createRelatedIssue, removed catchAsync and next
    try {
      const { sourceIssueId, targetIssueId, type: typeFromBody } = req.body;

      let numericEnumType: RelatedIssueType | undefined;
      const validNumericEnumValues = Object.values(RelatedIssueType).filter(v => typeof v === 'number') as number[];

      if (typeof typeFromBody === 'number') {
        if (validNumericEnumValues.includes(typeFromBody)) {
          numericEnumType = typeFromBody as RelatedIssueType;
        } else {
          throw new BadRequestException(
            `Invalid numeric relationship type: '${typeFromBody}'. Valid numeric types are: ${validNumericEnumValues.join(', ')}.`
          );
        }
      } else if (typeof typeFromBody === 'string' && typeFromBody.trim()) {
        const validEnumKeys = Object.keys(RelatedIssueType).filter(k => isNaN(Number(k)));
        const upperTypeString = typeFromBody.toUpperCase().replace(/\s+/g, '_');

        if (validEnumKeys.includes(upperTypeString)) {
          numericEnumType = RelatedIssueType[upperTypeString as keyof typeof RelatedIssueType];
        } else {
          throw new BadRequestException(
            `Invalid string relationship type: '${typeFromBody}'. Valid string types are: ${validEnumKeys.join(', ')} (case-insensitive, spaces can be used instead of underscores).`
          );
        }
      } else {
        throw new BadRequestException(
          'Relationship type must be a non-empty string or a valid numeric enum value.'
        );
      }

      if (numericEnumType === undefined) {
        throw new BadRequestException(
          `Could not determine a valid relationship type from input: '${typeFromBody}'.`
        );
      }

      const createDto: CreateRelatedIssueDto = {
        issueId: sourceIssueId,
        relatedIssueId: targetIssueId,
        type: numericEnumType,
      };

      if (!createDto.issueId || !createDto.relatedIssueId) {
        throw new BadRequestException(
          'Missing required fields: sourceIssueId or targetIssueId.'
        );
      }

      const relatedIssue = await this.relatedIssueService.create(
        createDto
      );
      res.status(201).json(relatedIssue);
    } catch (error: any) {
      // Assuming a generic error handler structure similar to IssueController
      // You might want to pass it to a centralized error handler middleware if you have one setup for non-catchAsync routes
      res.status(error.status || 500).json({
        message: error.message || "Internal server error",
        // Optionally include error.errors if it exists (e.g., for validation errors from class-validator)
        ...(error.errors && { errors: error.errors }),
      });
    }
  }
  async getById(req: Request, res: Response): Promise<void> { // Renamed, removed catchAsync and next
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestException("Related Issue ID is required in path parameters.");
      }
      const relatedIssue = await this.relatedIssueService.getById(id);
      res.status(200).json(relatedIssue);
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Internal server error",
      });
    }
  }

 
  async getAllByIssueId(req: Request, res: Response): Promise<void> { // Renamed, removed catchAsync and next
    try {
      const { issueId } = req.params;
      if (!issueId) {
        throw new BadRequestException("Issue ID is required in path parameters.");
      }
      const relatedIssues = await this.relatedIssueService.getAllByIssueId(issueId);
      res.status(200).json(relatedIssues);
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> { // Renamed, removed catchAsync and next
    try {
      const { id } = req.params;
      const updateDto: UpdateRelatedIssueDto = req.body;
      const typeFromBody: any = updateDto.type;

      if (!id || typeFromBody === undefined) {
        throw new BadRequestException("Relation ID and type are required.");
      }

      let numericEnumType: RelatedIssueType | undefined;
      const validNumericEnumValues = Object.values(RelatedIssueType).filter(v => typeof v === 'number') as number[];

      if (typeof typeFromBody === 'number') {
        if (validNumericEnumValues.includes(typeFromBody)) {
          numericEnumType = typeFromBody as RelatedIssueType;
        } else {
          throw new BadRequestException(
            `Invalid numeric relationship type: '${typeFromBody}'. Valid numeric types are: ${validNumericEnumValues.join(', ')}.`
          );
        }
      } else if (typeof typeFromBody === 'string' && typeFromBody.trim()) {
        const validEnumKeys = Object.keys(RelatedIssueType).filter(k => isNaN(Number(k)));
        const upperTypeString = typeFromBody.toUpperCase().replace(/\s+/g, '_');

        if (validEnumKeys.includes(upperTypeString)) {
          numericEnumType = RelatedIssueType[upperTypeString as keyof typeof RelatedIssueType];
        } else {
          throw new BadRequestException(
            `Invalid string relationship type: '${typeFromBody}'. Valid string types are: ${validEnumKeys.join(', ')} (case-insensitive, spaces can be used instead of underscores).`
          );
        }
      } else {
        throw new BadRequestException(
          'Relationship type must be a non-empty string or a valid numeric enum value for update.'
        );
      }

      if (numericEnumType === undefined) {
        throw new BadRequestException(
          `Could not determine a valid relationship type from input: '${typeFromBody}' for update.`
        );
      }

      const updatedRelation = await this.relatedIssueService.update(id, numericEnumType);
      res.status(200).json(updatedRelation);
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Internal server error",
      });
    }
  }
  async deleteById(req: Request, res: Response): Promise<void> { // Renamed, removed catchAsync and next
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestException("Relation ID is required in path parameters.");
      }
      await this.relatedIssueService.deleteById(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Internal server error",
      });
    }
  }
  async deleteByIssueIds(req: Request, res: Response): Promise<void> { // Renamed, removed catchAsync and next
    try {
      const { issueId, relatedIssueId } = req.params;
      if (!issueId || !relatedIssueId) {
        throw new BadRequestException("Both issueId and relatedIssueId are required in path parameters.");
      }
      await this.relatedIssueService.deleteByIssueIds(issueId, relatedIssueId);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Internal server error",
      });
    }
  }
}
