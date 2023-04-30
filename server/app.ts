import { Error } from "mongoose";
import express, { Application } from "express";
require("express-async-errors"); //The 'magic' of the library allows us to eliminate the try-catch blocks completely. Because of the library, we do not need the next(exception) call anymore. The library handles everything under the hood. If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.
import cors from "cors";
import dotenv from "dotenv";
import { requestLogger, unknownEndpoint, errorHandler } from "./utils/middleware";
import { infoLog, errorLog } from "./utils/logger";
import mongoose from "mongoose";
import { categoriesRouter } from "./controllers/categories";
import { ApolloServer, gql } from "apollo-server-express";
import typeDefs from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import { PORT, MONGODB_URI } from "./utils/config";

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
      // Categories.insertMany(categories);
    })
    .catch((err: Error) => {
      errorLog("error connecting to MongoDB:", err.message);
    });
  app.use(cors());
  app.use(express.static("dist"));
  app.use(express.json());
  app.use(requestLogger);

  app.use("/api/categories", categoriesRouter);

  app.use(unknownEndpoint);
  app.use(errorHandler);

  app.listen(PORT, (): void => {
    infoLog(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
};

export default startServer;
