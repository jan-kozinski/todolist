import { render, screen, cleanup, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

import EditTodoBtn from "../../components/EditTodoBtn";

describe("EditTodoBtn", () => {
  const setIsBeingEdited = jest.fn(() => {
    return;
  });
  it("Should render with proper styling and icon", () => {
    render(
      <EditTodoBtn
        className="fake-classname"
        setIsBeingEdited={setIsBeingEdited}
      />
    );
    const editBtn = screen.getByRole("button");
    expect(editBtn).toBeInTheDocument();
    expect(editBtn).toHaveClass(
      "bg-purple-700 hover:bg-purple-600 button fake-classname"
    );
    expect(
      screen.getByTestId("pencil-icon", { hidden: true })
    ).toBeInTheDocument();
    expect(setIsBeingEdited).toBeCalledTimes(0);

    act(() => {
      userEvent.click(editBtn);
    });
    expect(setIsBeingEdited).toBeCalledTimes(1);
  });
});
