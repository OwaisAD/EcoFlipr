import { Request, Response, Router } from "express";

export const categoriesRouter = Router();

const Category = require("../models/category");
const jwt = require("jsonwebtoken");

categoriesRouter.get("/", async (req: Request, res: Response) => {
  const categories = await Category.find({});
  res.json(categories);
});
