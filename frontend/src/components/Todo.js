import React, { useState, useEffect } from "react";
import AnimateHeight from "react-animate-height";
import TodoDescription from "./TodoDescription";
import EditDescription from "./EditDescription";

function Todo({ todo, deleteTodo }) {
  const [error, setError] = useState(null);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  //offsetHeight used for the smooth height change animation. Inittialy 1 to start the animation when fully mounted
  const [offsetHeight, setOffsetHeight] = useState(1);
  const [description, setDescription] = useState(todo.description);

  useEffect(() => {
    //Set height on mount and whenever the error message should be displayed/cleared or the isBeingEdited status changes
    setOffsetHeight(
      document.querySelector(`#item-${todo.id}-content`).offsetHeight
    );
  }, [todo.id, isBeingEdited, error]);

  return (
    <li id={`item-${todo.id}`} className="item flex justify-between">
      <AnimateHeight duration={500} height={offsetHeight} className="w-full">
        {isBeingEdited ? (
          <EditDescription
            todo={todo}
            description={description}
            setDescription={setDescription}
            setIsBeingEdited={setIsBeingEdited}
            error={error}
            setError={setError}
          />
        ) : (
          <TodoDescription
            todo={todo}
            description={description}
            deleteTodo={() => {
              setOffsetHeight(0);
              deleteTodo(todo.id);
            }}
            setIsBeingEdited={setIsBeingEdited}
          />
        )}
      </AnimateHeight>
    </li>
  );
}

export default Todo;
