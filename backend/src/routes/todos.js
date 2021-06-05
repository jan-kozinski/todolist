import express from "express";
import Todo from "../Schemas/Todo";
const debug = require("debug")("server:debug");

const router = express.Router();

router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find({}).exec();
    let todosToSend = [];
    for (var todoItem of todos) {
      todosToSend.push({
        id: todoItem._id,
        description: todoItem.description,
        completed: todoItem.completed,
      });
    }
    res.status(200).json({ success: true, payload: todosToSend });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.get("/todos/:id", async (req, res) => {
  try {
    const requestedItem = await searchTodoById(req.params.id);
    if (!(requestedItem instanceof Todo)) return requestedItem(res);

    if (requestedItem) {
      return res.status(200).json({
        success: true,
        payload: {
          description: requestedItem.description,
          id: requestedItem._id,
          completed: requestedItem.completed,
        },
      });
    }

    return res.status(404).json({
      success: false,
      message:
        "couldn't find the todo of given id. Please make sure the id is correct and try again",
    });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.post("/todos", async (req, res) => {
  try {
    let { description } = req.body;
    if (typeof description === "number") description = description.toString();
    if (typeof description !== "string" || description.length === 0)
      return res.status(422).json({
        success: false,
        message: "Description can't be empty!",
      });
    let newTodo = await new Todo({ description }).save();
    return res.status(200).json({
      success: true,
      payload: {
        description: newTodo.description,
        id: newTodo._id,
        completed: newTodo.completed,
      },
    });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.delete("/todos/:id", async (req, res) => {
  try {
    const isIdOfValidFormat = validateId(req.params.id);
    let requestedItem;
    if (isIdOfValidFormat) {
      requestedItem = await Todo.findById(req.params.id);
    }
    if (requestedItem) {
      await requestedItem.delete();
      return res.status(200).json({
        success: true,
        payload: {
          id: requestedItem._id,
          description: requestedItem.description,
        },
      });
    }

    return res.status(404).json({
      success: false,
      message:
        "couldn't find the todo of given id. Please make sure the id is correct and try again",
    });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.patch("/todos/check/:id", (req, res) => {
  toggleTodoCompleted(true, req, res);
});
router.patch("/todos/uncheck/:id", (req, res) => {
  toggleTodoCompleted(false, req, res);
});
router.patch("/todos/update/:id", async (req, res) => {
  try {
    let { description } = req.body;
    if (typeof description === "number") description = description.toString();
    if (typeof description !== "string" || description.length === 0)
      return res.status(422).json({
        success: false,
        message: "Description can't be empty!",
      });

    const requestedItem = await searchTodoById(req.params.id);
    if (!(requestedItem instanceof Todo)) return requestedItem(res);
    await requestedItem.update({ $set: { description } });
    return res.status(200).json({
      success: true,
      payload: {
        id: requestedItem._id,
        description,
        completed: false,
      },
    });
  } catch (error) {
    respondWithError(error);
  }
});

const toggleTodoCompleted = async (shouldBeChecked, req, res) => {
  try {
    const requestedItem = await searchTodoById(req.params.id);
    if (!(requestedItem instanceof Todo)) return requestedItem(res);
    await requestedItem.update({ $set: { completed: shouldBeChecked } });
    return res.status(200).json({
      success: true,
      payload: {
        id: requestedItem._id,
        description: requestedItem.description,
        completed: shouldBeChecked,
      },
    });
  } catch (error) {
    respondWithError(error, res);
  }
};

const validateId = (id) => id.match(/^[0-9a-fA-F]{24}$/);
const respondWithError = (error, res) => {
  debug(error);
  res.status(500).send({ succes: false, message: "internal server error" });
};
const searchTodoById = async (id, res) => {
  const respond404 = async (res) => {
    await res.status(404).json({
      success: false,
      message:
        "couldn't find the todo of given id. Please make sure the id is correct and try again",
    });
    return false;
  };
  const isIdOfValidFormat = validateId(id);
  if (!isIdOfValidFormat) return respond404;
  const requestedItem = await Todo.findById(id);
  if (!requestedItem) return respond404;
  return requestedItem;
};

module.exports = router;
