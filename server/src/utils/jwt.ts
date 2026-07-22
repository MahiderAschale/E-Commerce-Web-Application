import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  userId: string;
  role: "BUYER" | "ADMIN";
}

export const generateToken = (payload: JwtPayload): string => {
  const secret: Secret = env.JWT_SECRET;

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};