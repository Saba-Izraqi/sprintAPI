import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ProjectMemberService } from "../../app/services/project-members.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
  ProjectMemberResponseDto,
} from "../../domain/DTOs/project-memderDTO";
import { UserError } from "../../app/exceptions";

@injectable()
export class ProjectMemberController {
  constructor(
    @inject(ProjectMemberService)
    private projectMemberService: ProjectMemberService
  ) {}

  async addMember(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(CreateProjectMemberDto, req.body);
    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }

      const member = await this.projectMemberService.addMember(dto);
      res.status(201).json({
        member: new ProjectMemberResponseDto(member),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePermission(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(UpdateProjectMemberDto, req.body, {
      excludeExtraneousValues: true,
    });
    const { memberId } = req.params;

    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }

      const member = await this.projectMemberService.updatePermission(
        memberId,
        dto
      );
      res.status(200).json({
        member: new ProjectMemberResponseDto(member),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    const { memberId } = req.params;

    try {
      await this.projectMemberService.removeMember(memberId);
      res.status(200).json({
        message: "Project member removed successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProjectMembers(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;

    try {
      const members = await this.projectMemberService.getProjectMembers(
        projectId
      );
      const memberDtos = members.map(
        (member) => new ProjectMemberResponseDto(member)
      );
      res.status(200).json({
        members: memberDtos,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}