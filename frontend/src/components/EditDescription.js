import React, { useState, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function EditDescription({
  todo,
  description,
  setDescription,
  setIsBeingEdited,
  error,
  setError,
}) {
  //reference to the original description, used to prevent calling an API if the user didn't change anything
  let descriptionRef = useRef(description);
  let prevDescription = descriptionRef.current;

  const onSaveClick = async (e) => {
    e.preventDefault();
    if (!description) return setError(new Error("Description can't be empty!"));
    //don't call the API if the user didn't change anything
    if (prevDescription === description) return setIsBeingEdited(false);
    const result = await axios.patch(`/api/v1/todos/update/${todo.id}`, {
      description,
    });
    if (result.data.success) {
      setIsBeingEdited(false);
      //Update the reference to original description
      descriptionRef.current = description;
    } else setError(new Error(result.data.message));
  };

  const onDiscardClick = async (e) => {
    e.preventDefault();
    setIsBeingEdited(false);
  };

  return (
    <div className="p-4" id={`item-${todo.id}-content`}>
      <form role="form">
        <label htmlFor={`edit-${todo.id}`}>Description:</label>
        <textarea
          id={`edit-${todo.id}`}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="rounded resize-none block w-full p-2"
        />

        {error && <span>{error.message}</span>}

        <div className="flex justify-between">
          <button
            className="bg-purple-700 hover:bg-purple-600 focus:outline-none text-purple-50 p-2 rounded-md mt-2"
            type="submit"
            onClick={onSaveClick}
          >
            <FontAwesomeIcon icon={faCheck} />
            <span className="pl-2">Save</span>
          </button>

          <button
            className="bg-red-500 hover:bg-red-600 focus:outline-none text-purple-50 p-2 rounded-md mt-2"
            type="reset"
            onClick={onDiscardClick}
          >
            X Discard
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDescription;
