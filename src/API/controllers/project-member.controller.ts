import { plainToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";
import {
  CreateProjectMemberDto,
  ProjectMemberResponseDto,
} from "../../domain/DTOs/projectMemberDTO";
import { NextFunction, Request, Response } from "express";
import { UserError } from "../../app/exceptions";
import { validate } from "class-validator";
import { ProjectMembersService } from "../../app/services/project-members.service";

@injectable()
export class ProjectMembersController {
  constructor(
    @inject(ProjectMembersService) private service: ProjectMembersService
  ) {}

  async add(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(CreateProjectMemberDto, {
      ...req.body,
    });

    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }

      const membership = await this.service.add(dto);

      res.status(201).json({
        membership: new ProjectMemberResponseDto(membership),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
