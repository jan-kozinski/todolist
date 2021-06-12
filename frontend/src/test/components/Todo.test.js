import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todo from "../../components/Todo";
import axios from "axios";
describe("Todo", () => {
  let toggleHeightAnimation;
  beforeEach(() => {
    toggleHeightAnimation = jest.fn(() => {
      return;
    });
    axios.patch = jest.fn((url, body) => {
      const { description } = body;
      if (!description)
        return Promise.resolve({
          data: {
            success: false,
            message: "Something went wrong",
          },
        });
      else
        return Promise.resolve({
          data: {
            success: true,
            payload: { id: "any", description, completed: false },
          },
        });
    });
  });
  afterEach(cleanup);

  let todos = [];

  for (let i = 1; i <= 5; i++) {
    todos.push({
      id: i,
      description: `Do activity number ${i}`,
      completed: false,
    });
  }
  it("Should render", () => {
    render(
      <Todo todo={todos[0]} toggleHeightAnimation={toggleHeightAnimation} />
    );
    expect(screen.getByRole("listitem")).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveClass(
      "item flex justify-between"
    );
    expect(
      screen.queryByRole("form", { hidden: true })
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { hidden: true })).toHaveLength(2);
  });

  it("should render form after clicking Edit", () => {
    render(
      <Todo todo={todos[0]} toggleHeightAnimation={toggleHeightAnimation} />
    );
    expect(toggleHeightAnimation).toBeCalledTimes(0);
    act(() => {
      userEvent.click(screen.getAllByRole("button", { hidden: true })[0]);
    });
    expect(toggleHeightAnimation).toBeCalledTimes(1);
    expect(screen.getByRole("form", { hidden: true })).toBeInTheDocument();
    expect(
      screen.getByLabelText("Description:", { hidden: true })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Description:")).toHaveClass(
      "rounded resize-none block w-full p-2"
    );
  });

  it("If the description was empty it should display error and not call api patch", async () => {
    for (let i = 1; i <= 5; i++) {
      render(
        <Todo
          todo={todos[i - 1]}
          toggleHeightAnimation={toggleHeightAnimation}
        />
      );
      expect(
        screen.getByText(`Do activity number ${i}`, { hidden: true })
      ).toBeInTheDocument();
      let editBtn = screen.getAllByRole("button", { hidden: true })[0];
      act(() => {
        userEvent.click(editBtn);
      });
      expect(screen.getByRole("form", { hidden: true })).toBeInTheDocument();
      expect(screen.getByLabelText("Description:")).toBeInTheDocument();
      let textArea = screen.getByLabelText("Description:");
      expect(textArea).toHaveValue(`Do activity number ${i}`);
      act(() => {
        userEvent.clear(textArea);
      });
      expect(textArea).toHaveValue("");
      await act(async () => {
        userEvent.click(screen.getByText("save"));
      });
      expect(
        await screen.findByText("ERROR", { hidden: true })
      ).toBeInTheDocument();
      expect(axios.patch).toBeCalledTimes(0);

      expect(
        await screen.findByRole("form", { hidden: true })
      ).toBeInTheDocument();
      cleanup();
    }
  });
  it("Given the same, unchanged description should not call api patch and just hide the form", async () => {
    for (let i = 1; i <= 5; i++) {
      render(
        <Todo
          todo={todos[i - 1]}
          toggleHeightAnimation={toggleHeightAnimation}
        />
      );
      expect(
        screen.getByText(`Do activity number ${i}`, { hidden: true })
      ).toBeInTheDocument();
      let editBtn = screen.getAllByRole("button", { hidden: true })[0];
      act(() => {
        userEvent.click(editBtn);
      });

      let textArea = screen.getByLabelText("Description:");
      expect(textArea).toHaveValue(`Do activity number ${i}`);

      await act(async () => {
        userEvent.click(screen.getByText("save"));
      });
      expect(
        await screen.queryByRole("form", { hidden: true })
      ).not.toBeInTheDocument();
      expect(axios.patch).toHaveBeenCalledTimes(0);
      expect(
        await screen.findByText(`Do activity number ${i}`, { hidden: true })
      ).toBeInTheDocument();

      cleanup();
    }
  });
  it("Given a valid description should call api patch and hide the form", async () => {
    for (let i = 1; i <= 5; i++) {
      render(
        <Todo
          todo={todos[i - 1]}
          toggleHeightAnimation={toggleHeightAnimation}
        />
      );
      expect(
        screen.getByText(`Do activity number ${i}`, { hidden: true })
      ).toBeInTheDocument();
      let editBtn = screen.getAllByRole("button", { hidden: true })[0];
      act(() => {
        userEvent.click(editBtn);
      });

      let textArea = screen.getByLabelText("Description:");
      expect(textArea).toHaveValue(`Do activity number ${i}`);
      act(() => {
        userEvent.clear(textArea);
      });
      expect(textArea).toHaveValue("");

      await act(async () => {
        await userEvent.type(textArea, `Do something else instead-${i}`, {
          delay: 1,
        });
      });
      expect(textArea).toHaveValue(`Do something else instead-${i}`);

      await act(async () => {
        userEvent.click(screen.getByText("save"));
      });
      expect(axios.patch).toBeCalledTimes(i);
      expect(axios.patch.mock.calls[i - 1][0]).toBe(
        `/api/v1/todos/update/${i}`
      );
      expect(axios.patch.mock.calls[i - 1][1].description).toBe(
        `Do something else instead-${i}`
      );
      expect(
        await screen.queryByRole("form", { hidden: true })
      ).not.toBeInTheDocument();
      expect(
        await screen.queryByText(`Do activity number ${i}`, { hidden: true })
      ).not.toBeInTheDocument();

      expect(
        await screen.findByText(`Do something else instead-${i}`, {
          hidden: true,
        })
      ).toBeInTheDocument();

      cleanup();
    }
  });

  it("Should hide the form on discard button click", () => {
    render(
      <Todo todo={todos[0]} toggleHeightAnimation={toggleHeightAnimation} />
    );

    let editBtn = screen.getAllByRole("button", { hidden: true })[0];
    act(() => {
      userEvent.click(editBtn);
    });

    expect(screen.getByRole("form", { hidden: true })).toBeInTheDocument();

    act(() => {
      let discardBtn = screen.getByText("discard");
      userEvent.click(discardBtn);
    });
    expect(
      screen.queryByRole("form", { hidden: true })
    ).not.toBeInTheDocument();
  });
});
