import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { BoardColumnService } from "../../app/services/bourd-column.service";
import { CreateBoardColumnDto, UpdateBoardColumnDto } from "../../domain/DTOs/board-columnDTOs";

@injectable()
export class BoardColumnController {
  constructor(
    @inject(BoardColumnService) private readonly boardColumnService: BoardColumnService
  ) {}

  private handleError(error: unknown, res: Response, defaultStatusCode: number = 400): void {
    let message = "An unexpected error occurred";
    let statusCode = defaultStatusCode;

    if (error instanceof Error) {
      message = error.message;
      if (message.toLowerCase().includes("not found")) {
        statusCode = 404;
      }
    }
    res.status(statusCode).json({ error: message });
  }

  async createBoardColumn(req: Request, res: Response): Promise<void> {
    try {
      // Note: For DTOs with class-validator, you'd typically use a validation pipe/middleware
      // For now, we'll assume the body matches the DTO structure.
      const dto = req.body as CreateBoardColumnDto;
      const result = await this.boardColumnService.createBoardColumn(dto);
      res.status(201).json(result);
    } catch (error) {
      this.handleError(error, res, 400);
    }
  }

  async getAllBoardColumns(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.boardColumnService.getAllBoardColumns();
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res, 500);
    }
  }

  async getBoardColumnById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.boardColumnService.getBoardColumnById(id);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res); // Defaults to 400, will be 404 if "not found" in message
    }
  }

  async updateBoardColumn(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body as UpdateBoardColumnDto;
      const result = await this.boardColumnService.updateBoardColumn(id, dto);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res); // Defaults to 400, will be 404 if "not found" in message
    }
  }

  async deleteBoardColumn(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.boardColumnService.deleteBoardColumn(id);
      res.status(204).send(); // No content
    } catch (error) {
      this.handleError(error, res); // Defaults to 400, will be 404 if "not found" in message
    }
  }
}