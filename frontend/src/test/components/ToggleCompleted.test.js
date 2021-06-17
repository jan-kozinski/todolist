import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import ToggleCompleted from "../../components/ToggleCompleted";
describe("Toggle Todo completed", () => {
  beforeEach(() => {
    axios.patch = jest.fn((url) => {
      return Promise.resolve({ data: { success: true } });
    });
  });
  let todos = [];
  for (let i = 1; i <= 5; i++) {
    todos.push({
      id: i,
      description: `scratch place number ${i}`,
      completed: i % 2 === 0,
    });
  }
  //------TO-DO----
  it("Should render", () => {
    render(<ToggleCompleted todo={todos[0]} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button").innerHTML).toMatch("Completed:");
  });
  it("Should call API patch on click", async () => {
    for (let i = 0; i < 5; i++) {
      render(<ToggleCompleted todo={todos[i]} />);
      const toggleBtn = screen.getByRole("button");
      expect(axios.patch).toBeCalledTimes(i);
      await act(async () => {
        await userEvent.click(toggleBtn);
      });
      expect(axios.patch).toBeCalledTimes(i + 1);
      if (todos[i].completed)
        expect(axios.patch.mock.calls[i][0]).toBe(
          `/api/v1/todos/uncheck/${i + 1}`
        );
      else
        expect(axios.patch.mock.calls[i][0]).toBe(
          `/api/v1/todos/check/${i + 1}`
        );
      cleanup();
    }
  });
  it("Should display isCompleted status", () => {
    for (let i = 0; i < 5; i++) {
      render(<ToggleCompleted todo={todos[i]} />);
      if (todos[i].completed)
        expect(screen.getByTestId("fa-checked")).toBeInTheDocument();
      else expect(screen.getByText("X")).toBeInTheDocument();
      cleanup();
    }
  });
  it("Should change the display of isCompleted status when this status gets updated", async () => {
    for (let i = 0; i < 5; i++) {
      render(<ToggleCompleted todo={todos[i]} />);
      const toggleBtn = screen.getByRole("button");
      if (todos[i].completed)
        expect(screen.getByTestId("fa-checked")).toBeInTheDocument();
      else expect(screen.getByText("X")).toBeInTheDocument();
      await act(async () => {
        await userEvent.click(toggleBtn);
      });
      if (!todos[i].completed)
        expect(screen.getByTestId("fa-checked")).toBeInTheDocument();
      else expect(screen.getByText("X")).toBeInTheDocument();
      cleanup();
    }
  });
  it("Should display error and not change the display when API call is unsuccesfull", async () => {
    axios.patch = jest.fn((url) => {
      return Promise.resolve({
        data: { success: false, msg: "Something went terribly wrong" },
      });
    });
    for (let i = 0; i < 5; i++) {
      render(<ToggleCompleted todo={todos[i]} />);
      const toggleBtn = screen.getByRole("button");
      await act(async () => {
        await userEvent.click(toggleBtn);
      });
      expect(
        screen.getByText("Something went terribly wrong")
      ).toBeInTheDocument();
      cleanup();
    }
  });
});
