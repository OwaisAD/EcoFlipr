import mongoose, { Error } from "mongoose";
import express, { Application } from "express";
/*The 'magic' of the library allows us to eliminate the try-catch blocks completely. 
Because of the library, we do not need the next(exception) call anymore. 
The library handles everything under the hood. 
If an exception occurs in an async route, the execution is automatically passed 
to the error handling middleware.*/
require("express-async-errors");
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { requestLogger, unknownEndpoint, errorHandler } from "./utils/middleware";
import { infoLog, errorLog } from "./utils/logger";
import { categoriesRouter } from "./controllers/categories";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import { PORT, MONGO_URI } from "./utils/config";
import User from "./models/user";
import jwt from "jsonwebtoken";
import Category from "./models/category";
import { categories } from "./data/categories";
import City from "./models/city";
import { cities } from "./data/zipsAndCities";

dotenv.config();

const startServer = async () => {
  const app: Application = express();

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log("Development mode.");
  }

  app.use("/api/categories", categoriesRouter);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.startsWith("Bearer ")) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET!);
        if (typeof decodedToken === "string") {
          throw new Error("Invalid token.");
        }
        const currentUser = await User.findById({ _id: decodedToken.id });
        return { currentUser };
      }
    },
    persistedQueries: false,
  });
  await apolloServer.start(); // recommended to use .start() before listening to port with express
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.use((_req, res) => {
    res.send("Hello from express apollo server!");
  });

  const URL = MONGO_URI || "";
  mongoose.set("strictQuery", false);
  infoLog("connecting to db on: ", URL);

  await mongoose
    .connect(URL)
    .then(async () => {
      infoLog("connected to MongoDB");
      // await Category.insertMany(categories);
      // await City.insertMany(cities);
    })
    .catch((err: Error) => {
      errorLog("error connecting to MongoDB:", err.message);
    });
  app.use(cors());
  app.use(express.static("dist"));
  app.use(express.json());

  app.use(requestLogger);

  app.use(unknownEndpoint);
  app.use(errorHandler);

  app.listen(PORT, (): void => {
    infoLog(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
};

export default startServer;
