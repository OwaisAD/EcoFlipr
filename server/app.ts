// import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";

// dotenv.config();

// const app: Express = express();
// const port = process.env.PORT;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });

const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server is now running on port ${config.PORT}`);
});
