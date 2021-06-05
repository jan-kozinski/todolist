import request from "supertest";
import { expect } from "chai";
import { DBForTests as DB } from "./server.test.js";
import { serverForTests as server } from "./server.test.js";

describe("GET /api/v1/todos", async () => {
  let response, firstTodoItem;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "brush teeth" })
      .then((res) => res.body.payload);
    response = await request(server).get("/api/v1/todos");
  });
  after(async () => {
    await DB.dropDatabase();
  });

  it("status should be 200", () => {
    expect(response.status).to.equal(200);
  });

  it('success property should be "true"', () => {
    expect(response.body.success).to.equal(true);
  });

  it("payload should be an array", () => {
    expect(response.body.payload).to.be.an.instanceOf(Array);
  });
  it("payload array shouldn't be empty", () => {
    expect(response.body.payload.length).to.be.greaterThan(0);
  });
  it("each item in array should be of this format: {id: String, description: String, completed: Boolean}", () => {
    for (var item of response.body.payload) {
      expect("id" in item && "description" in item && "completed" in item).to.be
        .ok;
      expect(item.id).to.be.an("string");
      expect(item.description).to.be.an("string");
      expect(item.completed).to.be.an("boolean");
    }
  });
  it("item in array should match the inputed value ($firstTodoItem)", () => {
    let requestedItem = response.body.payload.find(
      (i) => i.id === firstTodoItem.id
    );
    expect(requestedItem).to.be.ok;
  });
});

describe("GET /api/v1/todos/:id given wrong id", async () => {
  let response;
  before(async () => {
    response = await request(server).get("/api/v1/todos/fake_id");
  });
  it("status should be 404", () => {
    expect(response.status).to.equal(404);
  });

  it('success property should be "false"', () => {
    expect(response.body.success).to.equal(false);
  });
  it('message should be "couldn\'t find the todo of of given id. Please make sure the id is correct and try again"', () => {
    expect(response.body.message).to.equal(
      "couldn't find the todo of given id. Please make sure the id is correct and try again"
    );
  });
});

describe("GET /api/v1/todos/:id given correct id", async () => {
  let firstResponse, firstTodoItem, secondResponse, secondTodoItem;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "pet the cat" });
    secondTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "grab a beer" });
    firstResponse = await request(server).get(
      `/api/v1/todos/${firstTodoItem.body.payload.id}`
    );
    secondResponse = await request(server).get(
      `/api/v1/todos/${secondTodoItem.body.payload.id}`
    );
  });
  after(async () => await DB.dropDatabase());
  it("status should be 200", () => {
    expect(firstResponse.status).to.equal(200);
    expect(secondResponse.status).to.equal(200);
  });

  it('success property should be "true"', () => {
    expect(firstResponse.body.success).to.equal(true);
    expect(secondResponse.body.success).to.equal(true);
  });
  it("payload should be an object", () => {
    expect(firstResponse.body.payload).to.be.an("object");
    expect(secondResponse.body.payload).to.be.an("object");
  });
  it("payload should contain the requested item data", () => {
    // first request
    expect(firstResponse.body.payload.description).to.equal("pet the cat");
    expect(firstResponse.body.payload.id).to.be.an("string");
    expect(firstResponse.body.payload.id).to.equal(
      firstTodoItem.body.payload.id
    );
    expect(firstResponse.body.payload.completed).to.equal(false);
    // second request
    expect(secondResponse.body.payload.description).to.equal("grab a beer");
    expect(secondResponse.body.payload.id).to.be.an("string");
    expect(secondResponse.body.payload.id).to.equal(
      secondTodoItem.body.payload.id
    );
    expect(secondResponse.body.payload.completed).to.equal(false);
  });
});
