import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DeleteTodoBtn from "./DeleteTodoBtn";
import EditTodoBtn from "./EditTodoBtn";
import AnimateHeight from "react-animate-height";
import useDidUpdateEffect from "../hooks/useOnUpdateEffect";

function Todo({ todo, deleteTodo, toggleHeightAnimation }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [error, setError] = useState(null);
  const [offsetHeight, setOffsetHeight] = useState("auto");
  const [description, setDescription] = useState(todo.description);
  let descriptionRef = useRef(description);
  let prevDescription = descriptionRef.current;

  const id = todo.id;
  const onSaveClick = async (e) => {
    e.preventDefault();
    if (!description) return setError(new Error("Description can't be empty!"));
    if (prevDescription === description) return setIsBeingEdited(false);
    const result = await axios.patch(`/api/v1/todos/update/${id}`, {
      description,
    });
    if (result.data.success) setIsBeingEdited(false);
    else setError(new Error(result.data.message));
  };
  const onDiscardClick = async (e) => {
    e.preventDefault();
    setIsBeingEdited(false);
  };

  useEffect(() => {
    setOffsetHeight(
      document.querySelector(`#item-${todo.id}-content`).offsetHeight
    );
  }, [setOffsetHeight, isBeingEdited]);

  useDidUpdateEffect(toggleHeightAnimation, [isBeingEdited]);

  return (
    <li id={`item-${todo.id}`} className="item flex justify-between">
      <AnimateHeight duration={500} height={offsetHeight} className="w-full">
        {isBeingEdited ? (
          <div className="p-4" id={`item-${todo.id}-content`}>
            <form role="form">
              <label htmlFor={`edit-${id}`}>Description:</label>
              <textarea
                id={`edit-${id}`}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="rounded resize-none block w-full p-2"
              ></textarea>
              {error && <span>ERROR</span>}
              <button type="submit" onClick={onSaveClick}>
                save
              </button>
              <button type="reset" onClick={onDiscardClick}>
                discard
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4" id={`item-${todo.id}-content`}>
            {description}
            <div className="flex justify-end">
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
          </div>
        )}
      </AnimateHeight>
    </li>
  );
}

export default Todo;
