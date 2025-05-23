import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { BoardService } from "../../app/services/board.service";
import { CreateBoardDto, UpdateBoardDto } from "../../domain/DTOs/boardDTO";
import { ApiError } from "../middlewares/error.middleware";

@injectable()
export class BoardController {
  constructor(
    @inject(BoardService) private readonly boardService: BoardService
  ) {}
  async createBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createBoardDto = req.body as CreateBoardDto;
      const boardResponse = await this.boardService.create(createBoardDto);
      
      // Add a flag to indicate if this was newly created or existing
      const wasExisting = !!boardResponse.createdAt && new Date(boardResponse.createdAt).getTime() < Date.now() - 5000;
      
      res.status(wasExisting ? 200 : 201).json({
        ...boardResponse,
        isExisting: wasExisting,
        success: true,
        message: wasExisting ? 
          "Retrieved existing board for this project" : 
          "New board created successfully"
      });
    } catch (error) {
      next(error);
    }
  }  async getAllBoards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const boards = await this.boardService.getAll();
      
      // Prepare response with metadata
      const response = {
        success: true,
        total: boards.length,
        data: boards,
        message: "Boards retrieved successfully"
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBoardByProjectId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const board = await this.boardService.getByProjectId(projectId);
      
      if (!board) {
        throw new ApiError(404, `Board with project ID "${projectId}" not found.`);
      }
      
      // Format the response with additional metadata
      const response = {
        success: true,
        data: board,
        sprintCount: board.sprintCount || 0,
        projectName: board.projectName,
        message: "Board retrieved successfully"
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async updateBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const updateBoardDto = req.body as UpdateBoardDto;
      
      const updatedBoard = await this.boardService.update(projectId, updateBoardDto);
      
      res.status(200).json({
        success: true,
        data: updatedBoard,
        message: "Board updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      
      // Note: In a real system, you might want to prevent board deletion since every project
      // must have a board. Instead, consider returning a warning.
      
      await this.boardService.delete(projectId);
      
      res.status(200).json({
        success: true,
        message: "Board deleted successfully. Note: You will need to create a new board for this project."
      });
    } catch (error) {
      next(error);
    }
  }
}
