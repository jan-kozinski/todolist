import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteTodoBtn from "./DeleteTodoBtn";
import EditTodoBtn from "./EditTodoBtn";
function Todo({ todo, deleteTodo, toggleHeightAnimation }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const id = todo.id;
  const onSaveClick = async (e) => {
    e.preventDefault();
    await axios.patch(`/api/v1/todos/${id}`, {});
    setIsBeingEdited(false);
  };
  const onDiscardClick = async (e) => {
    e.preventDefault();
    setIsBeingEdited(false);
  };

  useEffect(() => {
    let isStopped = false;
    if (!isStopped) toggleHeightAnimation();
    return () => {
      isStopped = true;
    };
  }, [isBeingEdited, toggleHeightAnimation]);

  if (isBeingEdited)
    return (
      <li
        key={todo.id}
        id={`item-${todo.id}`}
        className="item flex justify-between"
      >
        <form role="form" className="w-full">
          <label htmlFor={`edit-${id}`}>Description:</label>
          <textarea
            id={`edit-${id}`}
            className="rounded resize-none block w-full p-2"
          ></textarea>
          <button type="submit" onClick={onSaveClick}>
            save
          </button>{" "}
          <button type="reset" onClick={onDiscardClick}>
            discard
          </button>
        </form>
      </li>
    );
  else
    return (
      <li
        key={todo.id}
        id={`item-${todo.id}`}
        className="item flex justify-between"
      >
        {todo.description}
        <div className="flex">
          <EditTodoBtn
            className="mx-2"
            id={todo.id}
            setIsBeingEdited={setIsBeingEdited}
          />
          <DeleteTodoBtn
            id={todo.id}
            className="w-12"
            deleteTodo={deleteTodo}
          />
        </div>
      </li>
    );
}

export default Todo;
