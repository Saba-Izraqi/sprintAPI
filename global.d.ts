// Global type declarations
import { ITokenPayload } from './src/API/types';

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}
