import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { StatusService } from "../../app/services/status.service";
import { CreateStatusDto, UpdateStatusDto } from "../../domain/DTOs/statusDTO";

@injectable()
export class StatusController {
  constructor(
    @inject(StatusService) private statusService: StatusService
  ) {}  /**
   * @swagger
   * /api/v1/status:
   *   post:
   *     responses:
   *       201:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StatusesResponse'
   */
  async createStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = (req as any).validatedData as CreateStatusDto;
      const status = await this.statusService.createStatus(dto);
      
      res.status(201).json({
        statuses: [status]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/status/{id}:
   *   get:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StatusesResponse'
   */
  async getStatusById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const status = await this.statusService.getStatusById(id);
      
      res.status(200).json({
        statuses: [status]
      });
    } catch (error) {
      next(error);
    }  }

  /**
   * @swagger
   * /api/v1/status/column/{columnId}:
   *   get:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StatusesResponse'
   */
  async getStatusesByColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { columnId } = req.params;
      const statuses = await this.statusService.getStatusesByColumn(columnId);
      
      res.status(200).json({
        statuses
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/status:
   *   get:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StatusesResponse'
   */
  async getAllStatuses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statuses = await this.statusService.getAllStatuses();
      
      res.status(200).json({
        statuses
      });
    } catch (error) {
      next(error);
    }  }

  /**
   * @swagger
   * /api/v1/status/{id}:
   *   put:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StatusesResponse'
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = (req as any).validatedData as UpdateStatusDto;
      const status = await this.statusService.updateStatus(id, dto);
      
      res.status(200).json({
        statuses: [status]
      });
    } catch (error) {
      next(error);
    }  }

  /**
   * @swagger
   * /api/v1/status/{id}:
   *   delete:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StatusesResponse'
   */
  async deleteStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.statusService.deleteStatus(id);
      
      res.status(200).json({
        statuses: []
      });
    } catch (error) {
      next(error);
    }
  }
}
