import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { BoardColumnService } from "../../app/services/board-column.service";
import { CreateBoardColumnDto, UpdateBoardColumnDto } from "../../domain/DTOs/boardColumnDTO";
import { ApiError } from "../middlewares/error.middleware";

@injectable()
export class BoardColumnController {
  constructor(
    @inject(BoardColumnService) private readonly boardColumnService: BoardColumnService
  ) {}

  async createBoardColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createBoardColumnDto = req.body as CreateBoardColumnDto;
      const boardColumnResponse = await this.boardColumnService.create(createBoardColumnDto);
      res.status(201).json(boardColumnResponse);
    } catch (error) {
      next(error);
    }
  }

  async getAllBoardColumns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const boardColumns = await this.boardColumnService.getAll();
      res.status(200).json(boardColumns);
    } catch (error) {
      next(error);
    }
  }

  async getBoardColumnById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const boardColumn = await this.boardColumnService.getById(id);
      
      if (!boardColumn) {
        throw new ApiError(404, `Board column with ID "${id}" not found.`);
      }
      
      res.status(200).json(boardColumn);
    } catch (error) {
      next(error);
    }
  }

  async updateBoardColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateBoardColumnDto = req.body as UpdateBoardColumnDto;
      
      const updatedBoardColumn = await this.boardColumnService.update(id, updateBoardColumnDto);
      res.status(200).json(updatedBoardColumn);
    } catch (error) {
      next(error);
    }
  }

  async deleteBoardColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.boardColumnService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
