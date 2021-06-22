import {
  act,
  render,
  screen,
  cleanup,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Main from "../../components/Main";
describe("Main", () => {
  beforeEach(() => {
    axios.get = jest.fn(() =>
      Promise.reject({ data: { success: false, message: "Internal server" } })
    );
  });
  afterEach(cleanup);

  it("Should render and call the api right after", async () => {
    act(() => {
      render(<Main />);
    });
    expect(screen.getByRole("main")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText("Loading todos..."));
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get.mock.calls[0][0]).toMatch("/api/v1/todos");
  });
  it("Should have proper styling", async () => {
    act(() => {
      render(<Main />);
    });
    expect(screen.getByRole("main")).toHaveClass(
      "mx-auto lg:w-6/12 my-8 md:w-8/12 sm:w-10/12 w-auto min-h-screen"
    );
    await waitForElementToBeRemoved(() => screen.getByText("Loading todos..."));
  });
  it("Should display error message when can not communicate with the server", async () => {
    act(() => {
      render(<Main />);
    });
    expect(screen.getByText("Loading todos...")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText("Loading todos..."));
    expect(
      await screen.queryByText("Loading todos...")
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(
      await screen.findByText("Something went wrong...")
    ).toBeInTheDocument();
  });
});

describe("Main rendering Todos", () => {
  const todos = [
    {
      id: "1",
      description: "Pet the cat",
      completed: false,
    },
    {
      id: "2",
      description: "Buy some beer",
      completed: false,
    },
  ];
  beforeEach(() => {
    axios.get = jest.fn(() =>
      Promise.resolve({ data: { success: true, payload: todos } })
    );
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
    axios.delete = jest.fn((url, body) => {
      return Promise.resolve({
        data: {
          success: true,
          payload: {
            id: "1",
            description: "not an actual description",
            completed: false,
          },
        },
      });
    });
  });
  afterEach(cleanup);

  it("Should render todos after hitting the API and not before", async () => {
    act(() => {
      render(<Main />);
    });

    expect(screen.getByText("Loading todos...")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(axios.get).toBeCalledTimes(1);
    await waitForElementToBeRemoved(() => screen.getByText("Loading todos..."));
    expect(
      await screen.findAllByRole("listitem", { hidden: true })
    ).toHaveLength(2);
  });
  it("When new todo was created by the user it should push it to its state", async () => {
    act(() => {
      render(<Main />);
    });
    expect(
      await screen.findAllByRole("listitem", { hidden: true })
    ).toHaveLength(2);

    let textArea = screen.getByLabelText("Description:");
    expect(textArea).toHaveValue("");
    await act(async () => {
      await userEvent.type(textArea, "Mock the database", { delay: 1 });
      expect(textArea).toHaveValue("Mock the database");
      userEvent.click(screen.getByText("+"));
    });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0][0]).toMatch("/api/v1/todos");
    expect(axios.post.mock.calls[0][1]).toEqual({
      description: "Mock the database",
    });
    expect(textArea).toHaveValue("");
    expect(
      await screen.findAllByRole("listitem", { hidden: true })
    ).toHaveLength(3);
    let firstItemInList = (
      await screen.findAllByRole("listitem", { hidden: true })
    )[0];
    expect(firstItemInList.innerHTML).toMatch("Mock the database");
  });

  it("When todo is deleted by the user it should remove it from its state", async () => {
    act(() => {
      render(<Main />);
    });
    expect(
      await screen.findAllByRole("listitem", { hidden: true })
    ).toHaveLength(2);

    await act(async () => {
      jest.useFakeTimers();
      userEvent.click(screen.getByTestId("delete-2"));
      await waitForElementToBeRemoved(screen.getByTestId("delete-2"));
      jest.useRealTimers();
    });

    expect(axios.delete).toBeCalledTimes(1);
    expect(axios.delete.mock.calls[0][0]).toBe(`/api/v1/todos/2`);
    expect(
      await screen.findAllByRole("listitem", { hidden: true })
    ).toHaveLength(1);
  });
});
