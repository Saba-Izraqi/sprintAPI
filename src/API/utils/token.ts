import { sign } from "jsonwebtoken";
import { Token } from "../enums/token";
import { ITokenPayload } from "../types";

export const genToken = (payload: ITokenPayload): string => {
  return sign(
    { ...payload, tokenType: Token.ACCESS },
    "secretKeyPlaceHolderWillReplaceLater",
    {
      expiresIn: "24h",
    },
  );
};
