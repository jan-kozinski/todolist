import AnimateHeight from "react-animate-height";
import { useState, useEffect } from "react";
import Todo from "./Todo";

function Todos({ todos, deleteTodo }) {
  const [offsetHeight, setOffsetHeight] = useState("auto");
  const [todosWithOpenModals, setTodosWithOpenModals] = useState([]);
  useEffect(() => {
    setOffsetHeight(document.querySelector("#todosList").offsetHeight);
  }, [setOffsetHeight, todos, todosWithOpenModals]);
  return (
    <AnimateHeight duration={500} height={offsetHeight}>
      <ul id="todosList" className="pb-16">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            toggleHeightAnimation={() => {
              if (!todosWithOpenModals.includes(todo.id))
                setTodosWithOpenModals([...todosWithOpenModals, todo.id]);
              else {
                let updatedTodosWithModals = todosWithOpenModals.filter(
                  (t) => t.id !== todo.id
                );
                setTodosWithOpenModals(updatedTodosWithModals);
              }
            }}
          />
        ))}
      </ul>
    </AnimateHeight>
  );
}
export default Todos;
