import { expect } from "chai";
import config from "config";
import createApp from "../src/createApp";
import Database from "../src/database";

const DB = new Database(config.get("database"));
const server = createApp(DB);

const listen = server.listen(config.get("port"), () => {
  console.log(
    `server is running on port ${config.get("port")} in ${config.get(
      "name"
    )} mode`
  );
});
describe("Server", () => {
  it("should be running on proper port", () => {
    expect(listen.address().port).to.equal(config.get("port"));
  });
});

module.exports.serverForTests = server;
module.exports.DBForTests = DB;
