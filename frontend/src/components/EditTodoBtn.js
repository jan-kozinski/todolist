import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const EditTodoBtn = ({ className, setIsBeingEdited }) => {
  const defaultStyle = "bg-purple-700 hover:bg-purple-600 button ";
  return (
    <div className={className ? className : ""}>
      <button
        onClick={(e) => setIsBeingEdited(true)}
        className={className ? defaultStyle + className : defaultStyle}
      >
        <FontAwesomeIcon data-testid="pencil-icon" icon={faPencilAlt} />
      </button>
    </div>
  );
};

export default EditTodoBtn;
