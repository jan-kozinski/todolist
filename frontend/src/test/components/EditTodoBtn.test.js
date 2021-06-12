import { render, screen, cleanup, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

import EditTodoBtn from "../../components/EditTodoBtn";

describe("EditTodoBtn", () => {
  beforeEach(() => {
    axios.patch = jest.fn((url, body) => {
      return Promise.resolve({
        data: { success: false, message: "Invalid id" },
      });
    });
  });
  afterEach(cleanup);
  it("Should render with proper styling and icon", () => {
    render(<EditTodoBtn />);
    const editBtn = screen.getByRole("button");
    expect(editBtn).toBeInTheDocument();
    expect(editBtn).toHaveClass("bg-purple-700 hover:bg-purple-600 button");
    expect(
      screen.getByTestId("pencil-icon", { hidden: true })
    ).toBeInTheDocument();
  });
  it("Should render a form with textarea on click", async () => {
    render(<EditTodoBtn id={1} />);

    let editBtn = screen.getByRole("button");
    act(() => {
      userEvent.click(editBtn);
    });

    expect(
      await screen.findByRole("form", { hidden: true })
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText("Description:", { hidden: true })
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("Description:")).toHaveClass(
      "rounded resize-none block w-full p-2"
    );
    let buttons = await screen.findAllByRole("button");
    expect(buttons.length).toBe(2);
    console.log(buttons[0].innerHTML);
    expect(buttons[0].innerHTML).toMatch("save");
    expect(buttons[1].innerHTML).toMatch("discard");
    let saveButton = buttons[0];
    let discardButton = buttons[0];
    expect(saveButton).toBeInTheDocument();
    expect(saveButton.attributes).toHaveProperty("type");
    expect(saveButton.attributes.type.value).toEqual("submit");
    expect(discardButton).toBeInTheDocument();
  });

  it('Should call api patch and hide the form after clicking "save" ', async () => {
    for (let i = 1; i <= 5; i++) {
      render(<EditTodoBtn id={i} />);
      let editBtn = screen.getByRole("button");
      act(() => {
        userEvent.click(editBtn);
      });
      expect(axios.patch).toBeCalledTimes(i - 1);
      expect(
        await screen.findByRole("form", { hidden: true })
      ).toBeInTheDocument();

      await act(async () => {
        userEvent.click(await screen.findByText("save"));
      });
      expect(axios.patch).toBeCalledTimes(i);
      expect(axios.patch.mock.calls[i - 1][0]).toBe(`/api/v1/todos/${i}`);
      expect(
        await screen.queryByRole("form", { hidden: true })
      ).not.toBeInTheDocument();
      cleanup();
    }
  });
  it("Should hide the form on discard button click", async () => {
    render(<EditTodoBtn id={1} />);

    let editBtn = screen.getByRole("button");
    act(() => {
      userEvent.click(editBtn);
    });

    expect(
      await screen.findByRole("form", { hidden: true })
    ).toBeInTheDocument();

    await act(async () => {
      let discardBtn = await screen.findByText("discard");
      userEvent.click(discardBtn);
    });
    expect(
      await screen.queryByRole("form", { hidden: true })
    ).not.toBeInTheDocument();
  });
});
