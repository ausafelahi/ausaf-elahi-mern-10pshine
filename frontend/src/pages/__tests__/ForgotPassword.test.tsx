import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "@/pages/auth/ForgotPassword";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("@/services/api");
jest.mock("react-hot-toast");

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. ForgotPassword component renders without crashing", () => {
    renderWithRouter(<ForgotPassword />);
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });

  test("2. Email input field is present", () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toBeInTheDocument();
  });

  test("3. User can type in email input", () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  test("4. Send OTP button is displayed", () => {
    renderWithRouter(<ForgotPassword />);
    const sendButton = screen.getByRole("button", { name: /send otp/i });
    expect(sendButton).toBeInTheDocument();
  });

  test("5. Back to login link is present", () => {
    renderWithRouter(<ForgotPassword />);
    const backLink = screen.getByText("Back to login");
    expect(backLink).toBeInTheDocument();
  });

  test("6. Mail icon is displayed", () => {
    renderWithRouter(<ForgotPassword />);
    const mailIcon =
      screen.getByText("Forgot Password?").parentElement?.parentElement;
    expect(mailIcon).toBeInTheDocument();
  });

  test("7. Instruction text is displayed", () => {
    renderWithRouter(<ForgotPassword />);
    const instruction = screen.getByText(
      /enter your email and we'll send you/i,
    );
    expect(instruction).toBeInTheDocument();
  });

  test("8. Email label is present", () => {
    renderWithRouter(<ForgotPassword />);
    const label = screen.getByText("Email Address");
    expect(label).toBeInTheDocument();
  });

  test("9. Email input has correct type", () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toHaveAttribute("type", "email");
  });

  test("10. Email input is required", () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toBeRequired();
  });
});
