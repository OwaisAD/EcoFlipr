const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (req: Request, res: Response) => {
  console.log("CREATING USER");
});
