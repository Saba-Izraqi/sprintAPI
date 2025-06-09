import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass, ClassConstructor } from "class-transformer";
import { UserError } from "../../app/exceptions";

export function validateDTO<T extends object>(
  DtoClass: ClassConstructor<T>,
  source: "body" | "params" | "query" = "body"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(DtoClass, req[source]);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new UserError(errors, 400);
      }

      // Attach validated DTO to request for use in controller
      (req as any).validatedData = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Enhanced validation that merges URL params with body before validation
export function validateDTOWithParams<T extends object>(
  DtoClass: ClassConstructor<T>,
  paramsToMerge: string[] = []
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Merge specified URL parameters into the request body
      const mergedData = { ...req.body };
      paramsToMerge.forEach(param => {
        if (req.params[param]) {
          mergedData[param] = req.params[param];
        }
      });

      const dto = plainToClass(DtoClass, mergedData);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new UserError(errors, 400);
      }

      // Attach validated DTO to request for use in controller
      (req as any).validatedData = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}
