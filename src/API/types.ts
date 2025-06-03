import { Token } from "./enums/token";

export interface ITokenPayload {
  userId: string;
  userEmail: string;
  isEmailVerified: boolean;
  tokenType: Token;
}
