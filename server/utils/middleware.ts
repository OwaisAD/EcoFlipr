import { NextFunction, Request, Response } from "express";
import { infoLog, errorLog } from "./logger";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import {verifyToken} from "./AuthorizeRequest";

export const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  infoLog("Method:", request.method);
  infoLog("Path:  ", request.path);
  infoLog("Body:  ", request.body);
  infoLog("---");
  next();
};

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  errorLog(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization || "";
  const token = authHeader.replace("Bearer ","");
  if (token) {
    try {
      const decoded = verifyToken(token);
      // @ts-ignore
      request.user = decoded;
    } catch (error: unknown) {
      errorLog(error);
    }
  }
}