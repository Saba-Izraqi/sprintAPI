import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { ProjectMemberService } from "../../app/services/project-member.service";
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "../../domain/DTOs/projectMemberDTO";
import { ApiError } from "../middlewares/error.middleware";

@injectable()
export class ProjectMemberController {
  constructor(
    @inject(ProjectMemberService) private readonly projectMemberService: ProjectMemberService
  ) {}

  async createMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createMemberDto = req.body as CreateProjectMemberDto;
      const memberResponse = await this.projectMemberService.create(createMemberDto);
      res.status(201).json(memberResponse);
    } catch (error) {
      next(error);
    }
  }

  async getAllMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const members = await this.projectMemberService.getAll();
      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  }

  async getMemberById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const member = await this.projectMemberService.getById(id);
      
      if (!member) {
        throw new ApiError(404, `Project membership with ID "${id}" not found.`);
      }
      
      res.status(200).json(member);
    } catch (error) {
      next(error);
    }
  }
  
  async getMembersByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const members = await this.projectMemberService.getByProject(projectId);
      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  }
  
  async getMembershipsByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const memberships = await this.projectMemberService.getByUser(userId);
      res.status(200).json(memberships);
    } catch (error) {
      next(error);
    }
  }
  
  async getMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, projectId } = req.params;
      const membership = await this.projectMemberService.getMembership(userId, projectId);
      
      if (!membership) {
        throw new ApiError(404, `No membership found for user "${userId}" in project "${projectId}".`);
      }
      
      res.status(200).json(membership);
    } catch (error) {
      next(error);
    }
  }

  async updateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateMemberDto = req.body as UpdateProjectMemberDto;
      
      const updatedMember = await this.projectMemberService.update(id, updateMemberDto);
      res.status(200).json(updatedMember);
    } catch (error) {
      next(error);
    }
  }

  async deleteMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.projectMemberService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
