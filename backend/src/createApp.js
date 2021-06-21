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

  //SEND HTML FILE IN PRODUCTION MODE
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("../frontend/build"));

    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname + "../frontend/build/index.html"))
    );
  }

  if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

  return app;
}

module.exports = createApp;
