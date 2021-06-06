import Todo from "../Schemas/Todo";

const getTodos = async () => {
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
    return { success: true, todosToSend };
  } catch (error) {
    return { success: false, error };
  }
};
const getTodoById = async (id) => {
  try {
    const isIdValid = validateId(id);
    if (!isIdValid) throw new Error("BAD_REQUEST:INVALID_ID");
    const requestedItem = await Todo.findById(id);
    if (!requestedItem) throw new Error("BAD_REQUEST:INVALID_ID");
    return {
      success: true,
      requestedItem: {
        id: requestedItem._id,
        description: requestedItem.description,
        completed: requestedItem.completed,
      },
    };
  } catch (error) {
    return { success: false, error };
  }
};

const createTodo = async (description) => {
  try {
    if (typeof description === "number") description = description.toString();
    if (typeof description !== "string" || description.length === 0)
      throw new Error("BAD_REQUEST");

    let newTodo = await Todo({ description }).save();
    return {
      success: true,
      newTodo: {
        description: newTodo.description,
        id: newTodo._id,
        completed: newTodo.completed,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

const deleteTodoById = async (id) => {
  try {
    const isIdValid = validateId(id);
    if (!isIdValid) throw new Error("BAD_REQUEST:INVALID_ID");
    const requestedItem = await Todo.findById(id);
    if (!requestedItem) throw new Error("BAD_REQUEST:INVALID_ID");
    await requestedItem.delete();
    return {
      success: true,
      deletedItem: {
        id: requestedItem._id,
        description: requestedItem.description,
        completed: requestedItem.completed,
      },
    };
  } catch (error) {
    return { success: false, error };
  }
};

const toggleTodoCompleted = async (shouldBeChecked, id) => {
  try {
    const isIdValid = validateId(id);
    if (!isIdValid) throw new Error("BAD_REQUEST:INVALID_ID");
    const requestedItem = await Todo.findById(id);
    if (!requestedItem) throw new Error("BAD_REQUEST:INVALID_ID");
    await requestedItem.update({ $set: { completed: shouldBeChecked } });
    return {
      success: true,
      updatedItem: {
        id: requestedItem._id,
        description: requestedItem.description,
        completed: shouldBeChecked,
      },
    };
  } catch (error) {
    return { success: false, error };
  }
};

const updateTodoDescriptionByID = async (id, description) => {
  try {
    console.log("description", description, "type: ", typeof description);
    if (typeof description === "number") description = description.toString();

    if (typeof description !== "string" || description.length === 0)
      throw new Error("BAD_REQUEST");

    const isIdValid = validateId(id);
    if (!isIdValid) throw new Error("BAD_REQUEST:INVALID_ID");
    const requestedItem = await Todo.findById(id);
    if (!requestedItem) throw new Error("BAD_REQUEST:INVALID_ID");
    await requestedItem.update({ $set: { description } });
    return {
      success: true,
      updatedItem: {
        id: requestedItem._id,
        description,
        completed: requestedItem.completed,
      },
    };
  } catch (error) {
    return { success: false, error };
  }
};

const validateId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  deleteTodoById,
  toggleTodoCompleted,
  updateTodoDescriptionByID,
};
