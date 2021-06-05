import createApp from "./createApp";
import config from "config";
import Database from "./database";
const DB = new Database(config.get("database"));
const server = createApp(DB);

const listen = server.listen(config.get("port"), () => {
  console.log(
    `server is running on port ${config.get("port")} in ${config.get(
      "name"
    )} mode`
  );
});
module.exports = server;
