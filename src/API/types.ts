import { Token } from "./enums/token";

export interface ITokenPayload {
  userId: string;
  userEmail: string;
  isEmailVerified: boolean;
  tokenType: Token;
}

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}
