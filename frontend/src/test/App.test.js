import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("Should render a container", () => {
    render(<App />);
    expect(screen.getByTestId("container")).toBeInTheDocument();
  });
  it("Should render a header", () => {
    render(<App />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
  it("Should render main", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
  it("Should render a footer", () => {
    render(<App />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
