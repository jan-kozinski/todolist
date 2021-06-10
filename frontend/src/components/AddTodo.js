import axios from "axios";
import React, { useState, useEffect } from "react";
import AnimateHeight from "react-animate-height";

function AddTodo({ displayTodo }) {
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [offsetHeight, setOffsetHeight] = useState("auto");

  useEffect(() => {
    //offsetHeight doesn't count the box-shadow, hence the +5
    setOffsetHeight(document.querySelector("#addTodoContainer").offsetHeight);
  }, [setOffsetHeight, error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!description) return setError("Description can't be empty!");
      const result = await axios.post("/api/v1/todos", { description });
      setDescription("");
      console.log("before");
      if (!result.data.success) {
        console.log("after");
        return setError(result.data.message);
      }
      displayTodo(result.data.payload);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <AnimateHeight duration={500} height={offsetHeight}>
      <div id="addTodoContainer" className="pb-4">
        <div id="addTodoHeader">
          <h2 className="m-auto w-max text-2xl">Add Todo</h2>
        </div>
        <form role="form" className="item flex flex-col" onSubmit={onSubmit}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
            className="rounded focus:outline-none resize-none block w-full p-2 text-sm h-24"
          ></textarea>
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-600 button"
          >
            +
          </button>
          {error && (
            <span className="border-red-500 border-2 m-4 p-4 rounded-md bg-red-100">
              {error}
            </span>
          )}
        </form>
      </div>
    </AnimateHeight>
  );
}

export default AddTodo;
