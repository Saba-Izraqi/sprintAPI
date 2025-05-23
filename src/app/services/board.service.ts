import { injectable, inject } from "tsyringe";
import { plainToInstance } from 'class-transformer';
import { IBoardRepo } from "../../domain/IRepos/IBoardRepo";
import { CreateBoardDto, UpdateBoardDto, BoardResponseDto } from "../../domain/DTOs/boardDTO";
import { ApiError } from "../../API/middlewares/error.middleware";

@injectable()
export class BoardService {
  constructor(
    @inject("IBoardRepo") private readonly boardRepo: IBoardRepo
  ) {}  async create(createBoardDto: CreateBoardDto): Promise<BoardResponseDto> {
    // Check if a board already exists for this project
    const existingBoard = await this.boardRepo.findByProjectId(createBoardDto.projectId);
    
    if (existingBoard) {
      // If a board already exists, return it rather than throwing an error
      console.log(`Using existing board for project ID: ${existingBoard.projectId}`);
      return plainToInstance(BoardResponseDto, existingBoard, { excludeExtraneousValues: true });
    }

    // Log that we're creating a board for this project ID
    console.log(`Creating new board for project ID: ${createBoardDto.projectId}`);
    
    const newBoardEntity = await this.boardRepo.create(createBoardDto);
    return plainToInstance(BoardResponseDto, newBoardEntity, { excludeExtraneousValues: true });
  }
  async getAll(): Promise<BoardResponseDto[]> {
    const boards = await this.boardRepo.findAll();
    
    // Convert the raw boards to DTOs
    const boardDtos = plainToInstance(BoardResponseDto, boards, { excludeExtraneousValues: true });
    
    // Enhance each board with additional info
    return boardDtos.map(board => {
      const relatedBoard = boards.find(b => b.projectId === board.projectId);
      return {
        ...board,
        sprintCount: relatedBoard?.sprints?.length || 0,
        projectName: relatedBoard?.project?.name
      };
    });
  }

  async getByProjectId(projectId: string): Promise<BoardResponseDto | null> {
    const board = await this.boardRepo.findByProjectId(projectId);
    if (!board) {
      return null;
    }
    
    // Create the base DTO
    const boardDto = plainToInstance(BoardResponseDto, board, { excludeExtraneousValues: true });
    
    // Add additional useful information
    return {
      ...boardDto,
      sprintCount: board.sprints?.length || 0,
      projectName: board.project?.name
    };
  }

  async update(projectId: string, updateBoardDto: UpdateBoardDto): Promise<BoardResponseDto | null> {
    const existingBoard = await this.boardRepo.findByProjectId(projectId);
    if (!existingBoard) {
      throw new ApiError(404, `Board for project with ID "${projectId}" not found.`);
    }

    const updatedBoardEntity = await this.boardRepo.update(projectId, updateBoardDto);
    if (!updatedBoardEntity) {
      throw new ApiError(404, `Board for project with ID "${projectId}" could not be updated. It might have been deleted or the data was unchanged.`);
    }
    
    return plainToInstance(BoardResponseDto, updatedBoardEntity, { excludeExtraneousValues: true });
  }

  async delete(projectId: string): Promise<void> {
    const board = await this.boardRepo.findByProjectId(projectId);
    if (!board) {
      throw new ApiError(404, `Board for project with ID "${projectId}" not found.`);
    }
    await this.boardRepo.delete(projectId);
  }
}
