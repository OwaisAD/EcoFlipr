import { Request, Response, Router } from "express";

const bcrypt = require("bcrypt");
export const userRouter = Router();
const User = require("../models/user");

userRouter.post("/", async (req: Request, res: Response) => {
  console.log("CREATING USER");
  const { email, first_name, last_name, phone_number, address, password } = req.body;

  if (!email || !first_name || !last_name || !phone_number || !address || !password) {
    return res.status(400).json({ error: "missing user data" });
  }

  if (password.length < 3) {
    return res.status(400).json({
      error: "password length has to be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    first_name,
    last_name,
    phone_number,
    address,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});
