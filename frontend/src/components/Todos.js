import DeleteTodoBtn from "./DeleteTodoBtn";
import AnimateHeight from "react-animate-height";
import { useState, useEffect } from "react";

function Todos({ todos, deleteTodo }) {
  const [offsetHeight, setOffsetHeight] = useState("auto");
  useEffect(() => {
    //offsetHeight doesn't count the box-shadow, hence the +5
    setOffsetHeight(document.querySelector("#todosList").offsetHeight + 5);
  }, [setOffsetHeight, todos]);
  return (
    <AnimateHeight duration={500} height={offsetHeight}>
      <ul id="todosList">
        {todos.map((todo) => (
          <li
            key={todo.id}
            id={`item-${todo.id}`}
            className="item flex justify-between"
          >
            {todo.description}
            <DeleteTodoBtn id={todo.id} deleteTodo={deleteTodo} />
          </li>
        ))}
      </ul>
    </AnimateHeight>
  );
}
export default Todos;
