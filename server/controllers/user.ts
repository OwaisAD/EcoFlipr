import { Request, Response, Router } from "express";

const bcrypt = require("bcrypt");
export const userRouter = Router();
const User = require("../models/user");

userRouter.post("/", async (req: Request, res: Response) => {
  console.log("CREATING USER");
});
