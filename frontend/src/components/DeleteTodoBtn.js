import axios from "axios";
import React, { useRef } from "react";

function DeleteTodoBtn({ id, deleteTodo, className }) {
  //used to prevent user from excessive API calls
  const isProccessingRequest = useRef(false);
  const handleDeleteTodo = async () => {
    if (isProccessingRequest.current) return;
    isProccessingRequest.current = true;
    const result = await axios.delete(`/api/v1/todos/${id}`);
    if (result.data.success) deleteTodo(id); //Romoves the deleted todo from the screen
  };
  const defaultStyle = "bg-red-500 hover:bg-red-600 button font-bold ";
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
