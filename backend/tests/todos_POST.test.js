import request from "supertest";
import { expect } from "chai";
import { DBForTests as DB } from "./server.test.js";
import { serverForTests as server } from "./server.test.js";
describe("POST /api/v1/todos given proper input", () => {
  let response;
  before(async () => {
    response = await request(server)
      .post("/api/v1/todos")
      .set("Content-Type", "application/json")
      .send({ description: "pet the cat" });
  });
  after(async () => await DB.dropDatabase());
  it("status should be 200", () => {
    expect(response.status).to.equal(200);
  });

  it('success property should be "true"', () => {
    expect(response.body.success).to.equal(true);
  });

  it("payload should be an object", () => {
    expect(response.body.payload).to.be.an("object");
  });

  it("should save the newly created object to DB", async () => {
    const todosArray = await (
      await request(server).get("/api/v1/todos")
    ).body.payload;
    expect(todosArray.length).not.to.equal(0);
  });
  it("payload should contain the newly created object data", () => {
    expect(response.body.payload.description).to.equal("pet the cat");
    expect(response.body.payload.id).to.be.an("string");
    expect(response.body.payload.completed).to.equal(false);
  });
});

describe("POST /api/v1/todos given invalid input", () => {
  after(async () => DB.dropDatabase());
  it("given number value should stringify the input and treat it as a valid one", async () => {
    const response = await request(server)
      .post("/api/v1/todos")
      .set("Content-Type", "application/json")
      .send({ description: 4 });
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.payload).to.be.an("object");
    expect(response.body.payload.id).to.be.an("string");
    expect(response.body.payload.description).to.be.an("string");
    expect(response.body.payload.description).to.equal("4");

    expect(response.body.payload.completed).to.equal(false);
  });
  it("given empty input should respond with 422", async () => {
    const response = await request(server)
      .post("/api/v1/todos")
      .set("Content-Type", "application/json")
      .send({ description: "" });
    expect(response.status).to.equal(422);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.be.equal("Description can't be empty!");
  });
  it("given invalid input value should respond with 422", async () => {
    let inputs = [null, undefined, [], {}];
    let responses = [];

    for (let i of inputs) {
      let res = await request(server)
        .post("/api/v1/todos")
        .set("Content-Type", "application/json")
        .send({ description: i });
      responses.push(res);
    }
    for (let response of responses) {
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.be.equal("Description can't be empty!");
    }
  });
});
// INVALID REQUEST FORMAT NOT TESTED
