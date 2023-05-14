import { Request, Response, Router } from "express";
import Category from "../models/category";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req: Request, res: Response) => {
  const categories = await Category.find({});
  res.json(categories);
});
