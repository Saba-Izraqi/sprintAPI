import { Router } from "express";
import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { SprintController } from "../controllers/sprint.controller";
import { validateDTOWithParams, validateDTO } from "../middlewares/validation.middleware";
import { CreateSprintDto, UpdateSprintDto } from "../../domain/DTOs/sprintDTO";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { Token } from "../enums/token";

export class SprintRoutes extends BaseRoute {
  public path = "/:projectId/sprints";

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.initRoutes();
  }

  protected initRoutes(): void {
    const controller = container.resolve(SprintController);

    // Apply authentication and token restriction to all routes
    this.router.use(authenticate);
    this.router.use(restrictTokens(Token.ACCESS));

    // Project-specific sprint routes
    // GET /api/v1/project/:projectId/sprints - Get all sprints for a project
    this.router.get("/", (req, res) => controller.getSprintsByProject(req, res));

    // GET /api/v1/project/:projectId/sprints/active - Get active sprint for a project
    this.router.get("/active", (req, res) => controller.getActiveSprint(req, res));

    // POST /api/v1/project/:projectId/sprints - Create a new sprint
    this.router.post("/", 
      validateDTOWithParams(CreateSprintDto, ["projectId"]),
      (req, res) => controller.createSprint(req, res)
    );
  }
}

// Separate route class for individual sprint operations
export class SprintByIdRoutes extends BaseRoute {
  public path = "/sprint";

  protected initRoutes(): void {
    const controller = container.resolve(SprintController);

    // Apply authentication and token restriction to all routes
    this.router.use(authenticate);
    this.router.use(restrictTokens(Token.ACCESS));

    // Individual sprint routes
    // GET /api/v1/sprint/:id - Get sprint by ID
    this.router.get("/:id", (req, res) => controller.getSprintById(req, res));

    // PUT /api/v1/sprint/:id - Update sprint
    this.router.put("/:id", 
      validateDTO(UpdateSprintDto),
      (req, res) => controller.updateSprint(req, res)
    );

    // DELETE /api/v1/sprint/:id - Delete sprint
    this.router.delete("/:id", (req, res) => controller.deleteSprint(req, res));

    // POST /api/v1/sprint/:id/activate - Activate sprint
    this.router.post("/:id/activate", (req, res) => controller.activateSprint(req, res));

    // POST /api/v1/sprint/:id/complete - Complete sprint
    this.router.post("/:id/complete", (req, res) => controller.completeSprint(req, res));

    // GET /api/v1/sprint/:id/issues - Get sprint with issues
    this.router.get("/:id/issues", (req, res) => controller.getSprintWithIssues(req, res));
  }
}
