import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useRef } from "react";

function ToggleCompleted({ todo, className }) {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  //used to prevent user from excessive API calls
  const isProccessingRequest = useRef(false);
  const [error, setError] = useState(null);
  const handleClick = async () => {
    try {
      let result;
      if (isProccessingRequest.current) return;
      isProccessingRequest.current = true;
      if (todo.completed)
        result = await axios.patch(`/api/v1/todos/uncheck/${todo.id}`);
      else result = await axios.patch(`/api/v1/todos/check/${todo.id}`);
      if (result.data.success) setIsCompleted(!isCompleted);
      else setError(result.data.msg);
      isProccessingRequest.current = false;
    } catch (err) {
      if (err.response && err.response.data)
        setError(err.response.data.message);
      else setError("Something went wrong");
      isProccessingRequest.current = false;
    }
  };
  return (
    <div className={className}>
      <button
        className="mr-2 focus:outline-none"
        onClick={handleClick}
        children={"Completed: "}
      />
      {isCompleted ? (
        <FontAwesomeIcon data-testid="fa-checked" icon={faCheck} />
      ) : (
        <span className="font-bold px-1">X</span>
      )}
      {error && <span>{error}</span>}
    </div>
  );
}

export default ToggleCompleted;
