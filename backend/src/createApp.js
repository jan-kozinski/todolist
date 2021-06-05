const debug = require("debug")("server:debug");
import morgan from "morgan";
import config from "config";
//import { connectDB, dropDatabase } from "./database";
import express from "express";

// Routers
import todoRouter from "./routes/todos";

// const app = express();
// connectDB();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/api/v1/", todoRouter);
// if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// const listen = app.listen(config.get("port"), () => {
//   console.log(
//     `server is running on port ${config.get("port")} in ${config.get(
//       "name"
//     )} mode`
//   );
// });

// module.exports = app;
// module.exports.port = listen.address().port;

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
