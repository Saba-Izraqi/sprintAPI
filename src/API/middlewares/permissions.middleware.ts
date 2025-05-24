import { Request, Response, NextFunction } from "express";
import { ProjectPermission } from "../../domain/enums/types";

export function restrictToAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const permission = req.body.permission;

  if (permission !== ProjectPermission.ADMINISTRATOR) {
    res.status(403).json({
      success: false,
      message: "Forbidden: You do not have permission to perform this action",
    });
    return;
  }
  next();
}
