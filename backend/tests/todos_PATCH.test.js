import server from "../src/index";
import request from "supertest";
import { expect } from "chai";
import { dropDatabase } from "../src/databaseUtils";

describe("PATCH /api/v1/todos/check/:id", () => {
  let response, firstTodoItem, payload;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "make something" })
      .then((res) => res.body.payload);
    response = await request(server).patch(
      `/api/v1/todos/check/${firstTodoItem.id}`
    );
    payload = response.body.payload;
  });
  after(async () => {
    await dropDatabase();
  });
  it("status should be 200", () => {
    expect(response.status).to.equal(200);
  });
  it('success property should be "true"', () => {
    expect(response.body.success).to.equal(true);
  });
  it("payload should contain an object", () => {
    expect(payload).to.be.an("object");
  });
  it("payload should be of this format: {id: String, description: String, completed: Boolean}", () => {
    expect(
      "id" in payload && "description" in payload && "completed" in payload
    ).to.be.ok;
    expect(payload.id).to.be.an("string");
    expect(payload.description).to.be.an("string");
    expect(payload.completed).to.be.an("boolean");
  });
  it("payload object should keep the original id and description", () => {
    expect(payload.id).to.equal(firstTodoItem.id);
    expect(payload.description).to.equal(firstTodoItem.description);
  });
  it("payload completed property should be true", () => {
    expect(payload.completed).to.equal(true);
  });
  it("should update the appropriate database record to match the payload", async () => {
    let recordData = await request(server)
      .get(`/api/v1/todos/${payload.id}`)
      .then((res) => res.body.payload);
    expect(recordData).to.eql(payload);
  });
});

describe("PATCH /api/v1/todos/uncheck/:id", () => {
  let response, firstTodoItem, payload;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "make something" })
      .then((res) => res.body.payload);
    response = await request(server).patch(
      `/api/v1/todos/uncheck/${firstTodoItem.id}`
    );
    payload = response.body.payload;
  });
  after(async () => {
    await dropDatabase();
  });
  it("status should be 200", () => {
    expect(response.status).to.equal(200);
  });
  it('success property should be "true"', () => {
    expect(response.body.success).to.equal(true);
  });
  it("payload should contain an object", () => {
    expect(payload).to.be.an("object");
  });
  it("payload should be of this format: {id: String, description: String, completed: Boolean}", () => {
    expect(
      "id" in payload && "description" in payload && "completed" in payload
    ).to.be.ok;
    expect(payload.id).to.be.an("string");
    expect(payload.description).to.be.an("string");
    expect(payload.completed).to.be.an("boolean");
  });
  it("payload object should keep the original id and description", () => {
    expect(payload.id).to.equal(firstTodoItem.id);
    expect(payload.description).to.equal(firstTodoItem.description);
  });
  it("payload completed property should be true", () => {
    expect(payload.completed).to.equal(false);
  });
  it("should update the appropriate database record to match the payload", async () => {
    let recordData = await request(server)
      .get(`/api/v1/todos/${payload.id}`)
      .then((res) => res.body.payload);
    expect(recordData).to.eql(payload);
  });
});

describe("PATCH /api/v1/todos/check/:id and /api/v1/todos/uncheck/:id given wrong id", () => {
  let checkResponse, uncheckResponse, firstTodoItem;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "make something" })
      .then((res) => res.body.payload);
    checkResponse = await request(server).patch(`/api/v1/todos/check/fake_id`);
    uncheckResponse = await request(server).patch(
      `/api/v1/todos/uncheck/fake_id`
    );
  });
  after(async () => {
    await dropDatabase();
  });

  it("both requests status should be 404", () => {
    expect(checkResponse.status).to.equal(404);
    expect(uncheckResponse.status).to.equal(404);
  });

  it('both requests success property should be "false"', () => {
    expect(checkResponse.body.success).to.equal(false);
    expect(uncheckResponse.body.success).to.equal(false);
  });
  it('message should be "couldn\'t find the todo of given id. Please make sure the id is correct and try again"', () => {
    expect(checkResponse.body.message).to.equal(
      "couldn't find the todo of given id. Please make sure the id is correct and try again"
    );
    expect(uncheckResponse.body.message).to.equal(
      "couldn't find the todo of given id. Please make sure the id is correct and try again"
    );
  });
});

describe("PATCH /api/v1/todos/update/:id", () => {
  let response, firstTodoItem, payload;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "make something" })
      .then((res) => res.body.payload);
    response = await request(server)
      .patch(`/api/v1/todos/update/${firstTodoItem.id}`)
      .set("Content-Type", "application/json")
      .send({ description: "new updated description" });
    payload = response.body.payload;
  });
  after(async () => {
    await dropDatabase();
  });
  it("status should be 200", () => {
    expect(response.status).to.equal(200);
  });
  it('success property should be "true"', () => {
    expect(response.body.success).to.equal(true);
  });
  it("payload should contain an object", () => {
    expect(payload).to.be.an("object");
  });
  it("payload should be of this format: {id: String, description: String, completed: Boolean}", () => {
    expect(
      "id" in payload && "description" in payload && "completed" in payload
    ).to.be.ok;
    expect(payload.id).to.be.an("string");
    expect(payload.description).to.be.an("string");
    expect(payload.completed).to.be.an("boolean");
  });
  it("payload description should match the input, while keeping the original id and 'completed' value", () => {
    expect(payload.id).to.equal(firstTodoItem.id);
    expect(payload.description).to.equal("new updated description");
    expect(payload.completed).to.equal(firstTodoItem.completed);
  });
  it("should update the appropriate database record to match the payload", async () => {
    let recordData = await request(server)
      .get(`/api/v1/todos/${payload.id}`)
      .then((res) => res.body.payload);
    expect(recordData).to.eql(payload);
  });
});
// INVALID INPUT POSSIBILLITY NOT TESTED

describe("", () => {
  let firstTodoItem;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "make something" })
      .then((res) => res.body.payload);
  });
  after(async () => {
    await dropDatabase();
  });

  it("given number value should stringify the input and treat is as a valid one", async () => {
    const response = await request(server)
      .patch(`/api/v1/todos/update/${firstTodoItem.id}`)
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
      .patch(`/api/v1/todos/update/${firstTodoItem.id}`)
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
        .patch(`/api/v1/todos/update/${firstTodoItem.id}`)
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
