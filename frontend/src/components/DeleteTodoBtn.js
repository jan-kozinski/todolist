import axios from "axios";
import React from "react";

function DeleteTodoBtn({ id, deleteTodo, className }) {
  const handleDeleteTodo = async () => {
    const result = await axios.delete(`/api/v1/todos/${id}`);
    if (result.data.success) deleteTodo(id);
  };
  const defaultStyle = "bg-red-500 hover:bg-red-600 button ";
  return (
    <button
      onClick={handleDeleteTodo}
      data-testid={`delete-${id}`}
      className={className ? defaultStyle + className : defaultStyle}
    >
      X
    </button>
  );
}

export default DeleteTodoBtn;
