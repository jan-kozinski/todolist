import { expect } from "chai";
import config from "config";
import server from "../src/index";

describe("Server", () => {
  it("should be running on proper port", () => {
    expect(server.port).to.equal(config.get("port"));
  });
});
