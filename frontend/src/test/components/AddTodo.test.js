import { render, screen, cleanup, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

import AddTodo from "../../components/AddTodo";
describe("AddTodo", () => {
  beforeEach(async () => {
    render(<AddTodo />);
    axios.post = jest.fn((url, body) => {
      if (!body.description)
        return Promise.resolve({
          data: { success: false, message: "Description can't be empty!" },
        });
      else
        return Promise.resolve({
          data: {
            success: true,
            payload: {
              id: 42,
              description: body.description,
              completed: false,
            },
          },
        });
    });
  });
  afterEach(cleanup);
  it("Should render with proper styling", async () => {
    expect(screen.getByRole("form", { hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("form", { hidden: true })).toHaveClass(
      "item flex flex-col p-4"
    );
    expect(screen.getByLabelText("Description:")).toHaveClass(
      "rounded resize-none block w-full p-2"
    );
    expect(screen.getByRole("button", { hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("heading", { hidden: true })).toBeInTheDocument();
    expect(screen.getByText("Add Todo")).toBeInTheDocument();

    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("+")).toHaveClass(
      "bg-purple-700 hover:bg-purple-600 button"
    );
  });
  it("Should handle textarea input", async () => {
    let textArea = screen.getByLabelText("Description:");
    expect(textArea).toHaveValue("");
    await act(async () => {
      await userEvent.type(textArea, "Hello, World!", { delay: 1 });
    });
    expect(textArea).toHaveValue("Hello, World!");

    await act(async () => {
      userEvent.clear(textArea);
      await userEvent.type(textArea, "Do anything", { delay: 1 });
    });
    expect(textArea).toHaveValue("Do anything");
  });

  it("Should display error if submitted with empty description field", async () => {
    let textArea = screen.getByLabelText("Description:");

    expect(textArea).toHaveValue("");
    act(() => {
      userEvent.click(screen.getByText("+"));
    });
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(
      await screen.findByText("Description can't be empty!")
    ).toBeInTheDocument();
    //---TO-DO----
  });
});
