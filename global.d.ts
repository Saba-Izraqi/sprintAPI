// Global type declarations
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      isEmailVerified: boolean;
      tokenType: string;
      iat?: number;
      exp?: number;
    };
  }
}
