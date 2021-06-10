import axios from "axios";
import React, { useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import Todos from "./Todos";

function Main() {
  const [todos, setTodos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const addTodoToState = (todo) => {
    setTodos([todo, ...todos]);
  };
  const removeTodoFromState = (id) => {
    document.querySelector(`#item-${id}`).classList.add("fadeout", "opacity-0");
    const updatedTodosArray = todos.filter((todo) => todo.id !== id);
    setTimeout(() => {
      setTodos(updatedTodosArray);
    }, 600);
  };
  useEffect(() => {
    let isStopped = false;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if (!isStopped) {
      const getTodos = async () => {
        try {
          const fetchedTodos = (
            await axios.get("/api/v1/todos", { cancelToken: source.token })
          ).data.payload;
          if (!isStopped && fetchedTodos) {
            setTodos(fetchedTodos);
            setIsLoaded(true);
          }
        } catch (error) {
          if (!isStopped) setError(error);
        }
      };
      getTodos();
    }
    return () => {
      isStopped = true;
      if (source) source.cancel("operation canceled");
    };
  }, []);
  return (
    <main className="mx-auto my-8 w-6/12">
      {isLoaded ? (
        <>
          <AddTodo displayTodo={addTodoToState} />
          <Todos todos={todos} deleteTodo={removeTodoFromState} />
        </>
      ) : (
        <span>{error ? "Something went wrong..." : "Loading todos..."}</span>
      )}
    </main>
  );
}

export default Main;
