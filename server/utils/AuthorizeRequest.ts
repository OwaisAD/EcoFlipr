import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";

export const verifyToken = (token: string) => {
  try {
    // @ts-ignore
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error: unknown) {
    throw new AuthenticationError("Invalid or expired token");
  }
};

export const AuthorizeRequest = () => {};
