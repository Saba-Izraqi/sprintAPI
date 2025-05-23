import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class that includes HTTP status code
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle API errors with appropriate status codes and consistent response format
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default to 500 server error if no status code is specified
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  
  // Prepare error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  // Specific error handling based on error message patterns
  if (err.message.includes('not found')) {
    errorResponse.message = err.message;
    res.status(404).json(errorResponse);
  } else if (err.message.includes('already exists')) {
    errorResponse.message = err.message; 
    res.status(409).json(errorResponse);
  } else if (err.message.includes('validation failed')) {
    errorResponse.message = err.message;
    res.status(400).json(errorResponse);
  } else {
    // Handle other errors
    res.status(statusCode).json(errorResponse);
  }
};

/**
 * Handle 404 errors for routes that don't exist
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};
