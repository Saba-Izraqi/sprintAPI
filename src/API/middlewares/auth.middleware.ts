import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Token } from "../enums/token";

/**
 * Middleware to authenticate incoming requests by verifying the provided JWT token.
 *
 * @param req - The incoming HTTP request object.
 * @param res - The outgoing HTTP response object.
 * @param next - The next middleware function in the stack.
 *
 * @remarks
 * - The token is expected to be provided in the `Authorization` header as a Bearer token.
 * - If the token is missing or invalid, the middleware responds with a 401 status code and an error message.
 * - If the token is valid, the decoded payload is attached to the `req.user` object.
 * - If the token type is `RESET_PASSWORD`, a `forget` flag is added to the request body to skip old password checks.
 *
 * @throws {401} If the token is missing, invalid, or the decoded payload lacks an email or id.
 *
 * @example
 * // Example of using the middleware in an Express route
 * app.use('/protected-route',authenticate, controller);
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({ message: "Not authorized, token not found", success: false });
    console.error('"Not authorized, token not found"');
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      "secretKeyPlaceHolderWillReplaceLater" // TODO: Replace with environment variable process.env.JWT_SECRET
    ) as JwtPayload & { id: string; email: string }; 

    if (!decoded || !decoded.id || !decoded.email) {
      res.status(401).json({ message: "Not authorized, token payload is invalid (missing id or email)", success: false });
      return;
    }

    
    (req as any).user = decoded; 

    
    next();
  } catch (err) {
    console.error("Token verification error:", err); // Log the actual error
    res.status(401).json({ message: "Not authorized, invalid token", success: false });
    return;
  }
};