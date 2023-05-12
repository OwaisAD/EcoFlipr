import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;

export const MONGO_URI = (() => {
    switch (process.env.NODE_ENV) {
      case "production": return process.env.MONGO_PRODUCTION_URI;
      case "development": return process.env.MONGO_DEVELOPMENT_URI;
      case "test": return process.env.MONGO_TEST_URI;
      default: return "";
}})()
