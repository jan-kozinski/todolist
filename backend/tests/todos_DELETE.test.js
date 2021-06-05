import request from "supertest";
import { expect } from "chai";
import { DBForTests as DB } from "./server.test.js";
import { serverForTests as server } from "./server.test.js";

describe("DELETE /api/v1/todos/:id given wrong id", async () => {
  let response, firstTodoItem;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "make something" })
      .then((res) => res.body.payload);
    response = await request(server).delete(`/api/v1/todos/not_a_real_id`);
  });
  after(async () => {
    await DB.dropDatabase();
  });
  it("status should be 404", () => {
    expect(response.status).to.equal(404);
  });

  it('success property should be "false"', () => {
    expect(response.body.success).to.equal(false);
  });
  it('message should be "couldn\'t find the todo of given id. Please make sure the id is correct and try again"', () => {
    expect(response.body.message).to.equal(
      "couldn't find the todo of given id. Please make sure the id is correct and try again"
    );
  });
});

describe('DELETE /api/v1/todos/:id given correct id"', () => {
  let response, firstTodoItem;
  before(async () => {
    firstTodoItem = await request(server)
      .post("/api/v1/todos")
      .send({ description: "make something" })
      .then((res) => res.body.payload);
    response = await request(server).delete(
      `/api/v1/todos/${firstTodoItem.id}`
    );
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
  it("payload should contain the data of deleted object", () => {
    let payload = response.body.payload;
    expect(payload.id).to.equal(firstTodoItem.id);
    expect(payload.description).to.equal(firstTodoItem.description);
  });
  it("should remove the item from the database", async () => {
    const todosArray = await request(server)
      .get("/api/v1/todos")
      .then((res) => res.body.payload);
    expect(todosArray.length).to.equal(0);
    expect(
      todosArray.find((item) => item.id === response.body.payload.id)
    ).to.equal(undefined);
  });
});
