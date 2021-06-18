import React from "react";
import DeleteTodoBtn from "./DeleteTodoBtn";
import EditTodoBtn from "./EditTodoBtn";
import ToggleCompleted from "./ToggleCompleted";

function TodoDescription({ description, todo, setIsBeingEdited, deleteTodo }) {
  return (
    <div className="p-4" id={`item-${todo.id}-content`}>
      {description}

      <div className="flex justify-end">
        <ToggleCompleted
          className="mr-auto mt-auto rounded-md bg-purple-700 hover:bg-purple-600 p-2 text-purple-50"
          todo={todo}
        />

        <EditTodoBtn
          className="mx-2"
          id={todo.id}
          setIsBeingEdited={setIsBeingEdited}
        />
        <DeleteTodoBtn id={todo.id} className="w-12" deleteTodo={deleteTodo} />
      </div>
    </div>
  );
}

export default TodoDescription;
