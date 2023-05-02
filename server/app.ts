import { Error } from "mongoose";
import express, { Application } from "express";
require("express-async-errors"); //The 'magic' of the library allows us to eliminate the try-catch blocks completely. Because of the library, we do not need the next(exception) call anymore. The library handles everything under the hood. If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.
import cors from "cors";
import dotenv from "dotenv";
import {requestLogger, unknownEndpoint, errorHandler, authMiddleware} from "./utils/middleware";
import { infoLog, errorLog } from "./utils/logger";
import mongoose from "mongoose";
import { categoriesRouter } from "./controllers/categories";
import { ApolloServer, gql } from "apollo-server-express";
import typeDefs from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import { PORT, MONGODB_URI } from "./utils/config";
import { categories } from "./data/categories";
import { cities } from "./data/zipsAndCities";
import Category from "./models/category";
import City from "./models/city";
import User from "./models/user";

dotenv.config();

const startServer = async () => {
  const app: Application = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start(); // recommended to use .start() before listening to port with express
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.use((req, res) => {
    res.send("Hello from express apollo server!");
  });

  const URL = MONGODB_URI || "";
  mongoose.set("strictQuery", false);
  infoLog("connecting to db on: ", URL);

  await mongoose
    .connect(URL)
    .then(() => {
      infoLog("connected to MongoDB");
      //Category.insertMany(categories);
      //City.insertMany(cities);
      // User.insertMany([
      //   {
      //     email: "andreas@gmail.com",
      //     first_name: "Andreas",
      //     last_name: "Fritzbøger",
      //     phone_number: "4510101010",
      //     address: "Apple Blv 2",
      //     passwordHash: "hashedPassword",
      //   },
      //   {
      //     email: "daniel@gmail.com",
      //     first_name: "Daniel",
      //     last_name: "Fritzbøger",
      //     phone_number: "4510101010",
      //     address: "Apple Blv 2",
      //     passwordHash: "hashedPassword",
      //   },
      // ]);
    })
    .catch((err: Error) => {
      errorLog("error connecting to MongoDB:", err.message);
    });
  app.use(cors());
  app.use(express.static("dist"));
  app.use(express.json());
  // app.use(authMiddleware)
  app.use(requestLogger);

  app.use("/api/categories", categoriesRouter);

  app.use(unknownEndpoint);
  app.use(errorHandler);

  app.listen(PORT, (): void => {
    infoLog(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
};

export default startServer;
