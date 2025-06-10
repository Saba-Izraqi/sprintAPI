import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { BoardColumnService } from "../../app/services/board-column.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
  BoardColumnResponseDto,
} from "../../domain/DTOs/board-columnDTO";
import { UserError } from "../../app/exceptions";

@injectable()
export class BoardColumnController {
  constructor(
    @inject(BoardColumnService)
    private boardColumnService: BoardColumnService  ) {}

  /**
   * @swagger
   * /api/v1/board-column:
   *   post:
   *     responses:
   *       201:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ColumnsResponse'
   */
  async create(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(CreateBoardColumnDto, req.body);
    try {
      const errors = await validate(dto);
      if (errors.length) throw new UserError(errors);

      const column = await this.boardColumnService.create(dto);
      res.status(201).json({
        columns: [new BoardColumnResponseDto(column)]
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(UpdateBoardColumnDto, req.body);
    const { id } = req.params;
    try {
      const errors = await validate(dto);
      if (errors.length) throw new UserError(errors);

      const column = await this.boardColumnService.update(id, dto);
      res.status(200).json({
        columns: [new BoardColumnResponseDto(column)]
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.boardColumnService.delete(id);
      res.status(200).json({ 
        columns: []
      });
    } catch (error) {
      next(error);
    }
  }
  async get(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;
    try {
      const columns = await this.boardColumnService.get(projectId);
      res.status(200).json({
        columns
      });
    } catch (error) {
      next(error);
    }
  }
}
