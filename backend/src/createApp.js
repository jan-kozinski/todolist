const debug = require("debug")("server:debug");
import morgan from "morgan";
import express from "express";

// Routers
import todoRouter from "./routes/todos";

function createApp(database) {
  const app = express();

  database.connectDB();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/v1/", todoRouter);
  if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

  return app;
}

module.exports = createApp;
