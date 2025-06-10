import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ProjectMemberService } from "../../app/services/project-members.service";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
} from "../../domain/DTOs/project-memberDTO";
import { UserError } from "../../app/exceptions";

@injectable()
export class ProjectMemberController {
  constructor(
    @inject(ProjectMemberService) private _projectMemberService: ProjectMemberService
  ) {}

  /**
   * @swagger
   * /api/v1/project/{projectId}/project-members:
   *   post:
   *     responses:
   *       201:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ProjectMembersResponse"
   */
  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const createDto = req.body as CreateProjectMemberDto;
      createDto.projectId = req.params.projectId;
      
      const member = await this._projectMemberService.addMember(createDto);
      res.status(201).json({
        project_members: [member]
      });
    } catch (error) {
      if (error instanceof UserError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          errors: ["Failed to add member"],
        });
      }
    }
  }

  async updateMemberPermission(req: Request, res: Response): Promise<void> {
    try {
      const memberId = req.params.memberId;
      const updateDto = req.body as UpdateProjectMemberDto;
      
      const member = await this._projectMemberService.updateMemberPermission(
        memberId,
        updateDto
      );
      
      res.status(200).json({
        project_members: [member]
      });
    } catch (error) {
      if (error instanceof UserError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          errors: ["Failed to update member permission"],
        });
      }
    }
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const memberId = req.params.memberId;
      await this._projectMemberService.removeMember(memberId);
      
      res.status(200).json({
        project_members: []
      });
    } catch (error) {
      if (error instanceof UserError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          errors: ["Failed to remove member"],
        });
      }
    }
  }

  async getProjectMembers(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId;
      const members = await this._projectMemberService.getProjectMembers(projectId);
      
      res.status(200).json({
        project_members: members
      });
    } catch (error) {
      if (error instanceof UserError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          errors: ["Failed to retrieve project members"],
        });
      }
    }
  }

  async checkUserPermission(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { projectId } = req.params;
      const permission = await this._projectMemberService.checkUserPermission(
        userId,
        projectId
      );
      
      res.status(200).json({
        project_members: [{
          userId,
          projectId,
          permission,
          isMember: permission !== null,
        }]
      });
    } catch (error) {
      if (error instanceof UserError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          errors: ["Failed to check user permission"],
        });
      }
    }
  }
}
