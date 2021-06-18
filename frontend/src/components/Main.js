import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
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
    // Start the fading out animation for the item that is to be removed
    document.querySelector(`#item-${id}`).classList.add("fadeout", "opacity-0");
    // copy of state's todos that doesn't include the item that is about to be deleted
    const updatedTodosArray = todos.filter((todo) => todo.id !== id);
    // Wait for removed item to fade out
    setTimeout(() => {
      setTodos(updatedTodosArray);
    }, 600);
  };
  useEffect(() => {
    // race condition prevention
    let isStopped = false;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if (!isStopped) {
      //Call the API only if the component is mounted and is not going to unmount
      const getTodos = async () => {
        try {
          const fetchedTodos = (
            await axios.get("/api/v1/todos", { cancelToken: source.token })
          ).data.payload; //@array [ Object({id: String, description: String, completed: Boolean}) ]
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
    <main className="mx-auto my-8 w-6/12 min-h-screen">
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
