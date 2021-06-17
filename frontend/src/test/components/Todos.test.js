import { render, screen, cleanup } from "@testing-library/react";

import Todos from "../../components/Todos";

describe("Todos", () => {
  const todos = [
    {
      id: "1",
      description: "Read some news",
      completed: false,
    },
    {
      id: "2",
      description: "Buy cigarettes",
      completed: false,
    },
  ];

  afterEach(cleanup);

  it("Should render with proper styling", async () => {
    render(<Todos todos={todos} />);
    expect(
      await screen.findByRole("list", { hidden: true })
    ).toBeInTheDocument();
    expect(
      await screen.findAllByRole("listitem", { hidden: true })
    ).toHaveLength(2);
    expect(await screen.findAllByRole("button", { hidden: true })).toHaveLength(
      6
    );
    screen
      .queryAllByRole("listitem")
      .forEach((item) => expect(item).toHaveClass("item"));
    expect(screen.getByText("Read some news")).toBeInTheDocument();
    expect(screen.getByText("Buy cigarettes")).toBeInTheDocument();
  });
});
