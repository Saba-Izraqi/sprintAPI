
export interface ITokenPayload {
  id: string;
  email: string;
  isEmailVerified: boolean;
  tokenType: string;
  iat?: number;
  exp?: number;
}