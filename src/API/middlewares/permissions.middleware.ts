import { Request, Response, NextFunction } from "express";
import { ProjectPermission } from "../../domain/enums/types";
export function restrictTo(allowedPermission: ProjectPermission) {
  return function (req: Request, res: Response, next: NextFunction): void {
    //TODO : permission/role is not exist in the token. I should fetch the role for the user in the project from the DB.
    const permission = req.body.permission; 

    if (permission < allowedPermission) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to perform this action",
      });
      return;
    }

    next();
  };
}
