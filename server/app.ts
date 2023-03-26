import { Error } from "mongoose";
import express, { Application, Request, Response } from "express";

const config = require("./utils/config");
require("express-async-errors"); //The 'magic' of the library allows us to eliminate the try-catch blocks completely. For example the route for deleting a note. Because of the library, we do not need the next(exception) call anymore. The library handles everything under the hood. If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.
const app: Application = express();
const cors = require("cors");
import { requestLogger, unknownEndpoint, errorHandler } from "./utils/middleware";
import { infoLog, errorLog } from "./utils/logger";
const mongoose = require("mongoose");
const Categories = require("./models/category");
import { categories } from "./data/index";
import { categoriesRouter } from "./controllers/categories";
import { userRouter } from "./controllers/user";

mongoose.set("strictQuery", false);

infoLog("connecting to: ", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    infoLog("connected to MongoDB");
    // Categories.insertMany(categories);
  })
  .catch((err: Error) => {
    errorLog("error connecting to MongoDB:", err.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

// app.use("/api/blogs", middleware.userExtractor, blogsRouter);
// app.use("/api/users", usersRouter);
// app.use("/api/login", loginRouter);
app.use("/api/categories", categoriesRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
