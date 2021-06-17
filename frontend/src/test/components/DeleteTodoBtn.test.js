import { render, screen, cleanup, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

import DeleteTodoBtn from "../../components/DeleteTodoBtn";

describe("DeleteTodoBtn", () => {
  beforeEach(() => {
    axios.delete = jest.fn((url, body) => {
      return Promise.resolve({
        data: { success: false, message: "Invalid id" },
      });
    });
  });
  afterEach(cleanup);
  it("Should render with proper styling", () => {
    render(<DeleteTodoBtn />);
    const deleteBtn = screen.getByRole("button");
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn.innerHTML).toMatch("X");
    expect(deleteBtn).toHaveClass("bg-red-500 hover:bg-red-600 button");
  });
  it("Should call api delete on click", () => {
    for (let i = 1; i <= 5; i++) {
      render(<DeleteTodoBtn id={i} />);
      let deleteBtn = screen.getByRole("button");
      act(() => {
        userEvent.click(deleteBtn);
      });
      expect(axios.delete).toBeCalledTimes(i);
      expect(axios.delete.mock.calls[i - 1][0]).toBe(`/api/v1/todos/${i}`);
      cleanup();
    }
  });
  it("Should call API only once after excessive clicking", () => {
    render(<DeleteTodoBtn id={1} />);
    let deleteBtn = screen.getByRole("button");
    act(() => {
      for (let i = 0; i < 5; i++) {
        userEvent.dblClick(deleteBtn);
      }
    });
    expect(axios.delete).toBeCalledTimes(1);
    expect(axios.delete.mock.calls[0][0]).toBe(`/api/v1/todos/${1}`);
  });
});
