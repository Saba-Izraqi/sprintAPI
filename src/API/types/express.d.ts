import { JwtPayload } from 'jsonwebtoken';

// Extend Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        email: string;
        isEmailVerified: boolean;
        tokenType: string;
      };
    }
  }
}

export {};
