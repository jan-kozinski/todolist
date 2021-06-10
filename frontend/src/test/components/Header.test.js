import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";
describe("Header", () => {
  it("Should render with proper text and styling", () => {
    render(<Header />);
    expect(screen.getByText("TODOS")).toBeInTheDocument();
    expect(screen.getByText("TODOS")).toHaveClass(
      "mx-auto w-6/12 text-white text-4xl"
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toHaveClass(
      "bg-red-500 mx-auto w-auto py-4  shadow-bot"
    );
  });
});
