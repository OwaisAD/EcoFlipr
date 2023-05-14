import { NextFunction, Request, Response } from "express";
import { infoLog, errorLog } from "./logger";

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  infoLog("Method:", req.method);
  infoLog("Path:  ", req.path);
  infoLog("Body:  ", req.body);
  infoLog("---");
  next();
};

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  errorLog(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(400).json({ error: "invalid token" });
  } else if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    });
  }

  next(err);
};