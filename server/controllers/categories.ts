import { Request, Response } from "express";

const categoriesRouter = require("express").Router();

const Category = require("../models/category");
const jwt = require("jsonwebtoken");

categoriesRouter.get("/", async (req: Request, res: Response) => {
  const categories = await Category.find({});
  res.json(categories);
});

module.exports = categoriesRouter;
