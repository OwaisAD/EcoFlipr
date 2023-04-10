import { NextFunction, Request, Response } from "express";
import { infoLog, errorLog } from "./logger";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

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

// const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
//   const authorization = req.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     req.token = authorization.replace("Bearer ", "");
//   }
//   next();
// };

// const userExtractor = async (req: Request, res: Response, next: NextFunction) => {
//   const decodedToken = jwt.verify(req.token, process.env.SECRET);

//   if (!decodedToken.id) {
//     return res.status(401).json({ error: "token invalid" });
//   }

//   const user = await User.findById(decodedToken.id);

//   if (!user) {
//     return res.status(401).json({ error: "invalid token" });
//   }

//   req.user = user;

//   next();
// };

// module.exports = {
//   requestLogger,
//   unknownEndpoint,
//   errorHandler,
//   // tokenExtractor,
//   // userExtractor,
// };
