import axios from "axios";
import React from "react";

function DeleteTodoBtn({ id, deleteTodo }) {
  const handleDeleteTodo = async () => {
    const result = await axios.delete(`/api/v1/todos/${id}`);
    if (result.data.success) deleteTodo(id);
  };
  return (
    <button
      onClick={handleDeleteTodo}
      data-testid={`delete-${id}`}
      className="bg-red-500 hover:bg-red-600 button"
    >
      X
    </button>
  );
}

export default DeleteTodoBtn;
