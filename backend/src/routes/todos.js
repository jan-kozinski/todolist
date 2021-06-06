import express from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  deleteTodoById,
  toggleTodoCompleted,
  updateTodoDescriptionByID,
} from "../controllers/todoController";

const debug = require("debug")("server:debug");

const router = express.Router();

router.get("/todos", async (req, res) => {
  try {
    const result = await getTodos();
    if (!result.success) throw result.error;

    res.status(200).json({ success: true, payload: result.todosToSend });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.get("/todos/:id", async (req, res) => {
  try {
    const result = await getTodoById(req.params.id);

    if (!result.success) throw result.error;

    const { requestedItem } = result;
    return res.status(200).json({
      success: true,
      payload: {
        description: requestedItem.description,
        id: requestedItem.id,
        completed: requestedItem.completed,
      },
    });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.post("/todos", async (req, res) => {
  try {
    const result = await createTodo(req.body.description);
    if (!result.success) throw result.error;

    return res.status(200).json({
      success: true,
      payload: result.newTodo,
    });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.delete("/todos/:id", async (req, res) => {
  try {
    const result = await deleteTodoById(req.params.id);
    if (!result.success) throw result.error;
    return res.status(200).json({ success: true, payload: result.deletedItem });
  } catch (error) {
    respondWithError(error, res);
  }
});

router.patch("/todos/check/:id", async (req, res) => {
  try {
    const result = await toggleTodoCompleted(true, req.params.id);
    if (!result.success) throw result.error;
    res.status(200).json({ success: true, payload: result.updatedItem });
  } catch (error) {
    respondWithError(error, res);
  }
});
router.patch("/todos/uncheck/:id", async (req, res) => {
  try {
    const result = await toggleTodoCompleted(false, req.params.id);
    if (!result.success) throw result.error;
    res.status(200).json({ success: true, payload: result.updatedItem });
  } catch (error) {
    respondWithError(error, res);
  }
});
router.patch("/todos/update/:id", async (req, res) => {
  try {
    const result = await updateTodoDescriptionByID(
      req.params.id,
      req.body.description
    );
    if (!result.success) throw result.error;
    res.status(200).json({ success: true, payload: result.updatedItem });
  } catch (error) {
    respondWithError(error, res);
  }
});

const respondWithError = (error, res) => {
  const isError404 = /BAD_REQUEST:INVALID_ID/.test(error.message);
  if (isError404)
    return res.status(404).json({
      success: false,
      message:
        "couldn't find the todo of given id. Please make sure the id is correct and try again",
    });

  const isErrorBadRequest = /BAD_REQUEST/.test(error.message);
  if (isErrorBadRequest)
    return res.status(422).json({
      success: false,
      message: "Description can't be empty!",
    });
  debug(error);
  return res
    .status(500)
    .send({ succes: false, message: "internal server error" });
};

module.exports = router;
