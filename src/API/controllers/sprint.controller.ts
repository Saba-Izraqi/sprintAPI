import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { SprintService } from "../../app/services/sprint.service";
import { CreateSprintDto, UpdateSprintDto } from "../../domain/DTOs/sprintDTO";

@injectable()
export class SprintController {
  constructor(    @inject(SprintService) private sprintService: SprintService
  ) {}

  /**
   * @swagger
   * /api/v1/project/{projectId}/sprints:
   *   post:
   *     responses:
   *       201:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SprintsResponse'
   */
  async createSprint(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const sprintData = { ...req.body, projectId } as CreateSprintDto;
      const sprint = await this.sprintService.createSprint(sprintData);
      
      res.status(201).json({
        sprints: [sprint]
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to create sprint",
      });
    }
  }

  /**
   * @swagger
   * /api/v1/sprint/{id}:
   *   get:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SprintsResponse'
   */
  async getSprintById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sprint = await this.sprintService.getSprintById(id);
      
      res.status(200).json({
        sprints: [sprint]
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Sprint not found",
      });
    }
  }

  async getSprintsByProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const sprints = await this.sprintService.getSprintsByProject(projectId);
        res.status(200).json({
        sprints
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Project not found",
      });
    }
  }
  async getActiveSprint(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const sprint = await this.sprintService.getActiveSprintByProject(projectId);
      
      res.status(200).json({
        sprints: sprint ? [sprint] : []
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Project not found",
      });
    }
  }
  async updateSprint(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body as UpdateSprintDto;
      const sprint = await this.sprintService.updateSprint(id, updates);
      
      res.status(200).json({
        sprints: [sprint]
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to update sprint",
      });
    }
  }
  async deleteSprint(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.sprintService.deleteSprint(id);
      
      res.status(200).json({
        sprints: []
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete sprint",
      });
    }
  }
  async activateSprint(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sprint = await this.sprintService.activateSprint(id);
      
      res.status(200).json({
        sprints: [sprint]
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to activate sprint",
      });
    }
  }
  async completeSprint(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sprint = await this.sprintService.completeSprint(id);
      
      res.status(200).json({
        sprints: [sprint]
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to complete sprint",
      });
    }
  }
  async getSprintWithIssues(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sprintWithIssues = await this.sprintService.getSprintWithIssues(id);
      
      res.status(200).json({
        sprints: [sprintWithIssues]
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Sprint not found",
      });
    }
  }
}
