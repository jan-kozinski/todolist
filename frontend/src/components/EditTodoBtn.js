import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const EditTodoBtn = ({ id, className, setIsBeingEdited }) => {
  //const [isBeingEdited, setIsBeingEdited] = useState(false);
  // const onSaveClick = async (e) => {
  //   e.preventDefault();
  //   await axios.patch(`/api/v1/todos/${id}`, {});
  //   setIsBeingEdited(false);
  // };
  // const onDiscardClick = async (e) => {
  //   e.preventDefault();
  //   setIsBeingEdited(false);
  // };

  return (
    <div className={className ? className : ""}>
      <button
        onClick={(e) => setIsBeingEdited(true)}
        className="bg-purple-700 hover:bg-purple-600 button"
      >
        <FontAwesomeIcon data-testid="pencil-icon" icon={faPencilAlt} />
      </button>
    </div>
  );

  // return (
  //   <div className={className ? className : ""}>
  //     {isBeingEdited ? (
  //       <form role="form">
  //         <label htmlFor={`edit-${id}`}>Description:</label>
  //         <textarea
  //           id={`edit-${id}`}
  //           className="rounded resize-none block w-full p-2"
  //         ></textarea>
  //         <button type="submit" onClick={onSaveClick}>
  //           save
  //         </button>{" "}
  //         <button type="reset" onClick={onDiscardClick}>
  //           discard
  //         </button>
  //       </form>
  //     ) : (
  // <button
  //   onClick={(e) => setIsBeingEdited(true)}
  //   className="bg-purple-700 hover:bg-purple-600 button"
  // >
  //   <FontAwesomeIcon data-testid="pencil-icon" icon={faPencilAlt} />
  // </button>
  //     )}
  //   </div>
};

export default EditTodoBtn;
