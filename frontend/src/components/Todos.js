import DeleteTodoBtn from "./DeleteTodoBtn";
import AnimateHeight from "react-animate-height";
import { useState, useEffect } from "react";
import EditTodoBtn from "./EditTodoBtn";
import Todo from "./Todo";

function Todos({ todos, deleteTodo }) {
  const [offsetHeight, setOffsetHeight] = useState("auto");
  const [todosWithOpenModals, setTodosWithOpenModals] = useState([]);
  useEffect(() => {
    setOffsetHeight(document.querySelector("#todosList").offsetHeight);
  }, [setOffsetHeight, todos, todosWithOpenModals]);
  return (
    <AnimateHeight duration={700} height={offsetHeight}>
      <ul id="todosList" className="pb-2">
        {todos.map((todo) => (
          <Todo
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
