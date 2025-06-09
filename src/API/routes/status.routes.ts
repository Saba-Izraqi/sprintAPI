import { Router } from "express";
import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { StatusController } from "../controllers/status.controller";
import { validateDTO } from "../middlewares/validation.middleware";
import { CreateStatusDto, UpdateStatusDto } from "../../domain/DTOs/statusDTO";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { Token } from "../enums/token";

export class StatusRoutes extends BaseRoute {
  public path = "/status";

  protected initRoutes(): void {
    const controller = container.resolve(StatusController);

    // Apply authentication and token restriction to all routes
    this.router.use(authenticate);
    this.router.use(restrictTokens(Token.ACCESS));

    // POST /api/v1/status - Create a new status
    this.router.post("/", 
      validateDTO(CreateStatusDto),
      (req, res, next) => controller.createStatus(req, res, next)
    );

    // GET /api/v1/status - Get all statuses
    this.router.get("/", (req, res, next) => controller.getAllStatuses(req, res, next));

    // GET /api/v1/status/:id - Get status by ID
    this.router.get("/:id", (req, res, next) => controller.getStatusById(req, res, next));

    // GET /api/v1/status/column/:columnId - Get statuses by column ID
    this.router.get("/column/:columnId", (req, res, next) => controller.getStatusesByColumn(req, res, next));

    // PUT /api/v1/status/:id - Update status
    this.router.put("/:id", 
      validateDTO(UpdateStatusDto),
      (req, res, next) => controller.updateStatus(req, res, next)
    );

    // DELETE /api/v1/status/:id - Delete status
    this.router.delete("/:id", (req, res, next) => controller.deleteStatus(req, res, next));
  }
}
