import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignIn from "@/pages/auth/SignIn";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("@/services/api");
jest.mock("react-hot-toast");

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. SignIn component renders without crashing", () => {
    renderWithRouter(<SignIn />);
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
  });

  test("2. Email input field is present", () => {
    renderWithRouter(<SignIn />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toBeInTheDocument();
  });

  test("3. Password input field is present", () => {
    renderWithRouter(<SignIn />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toBeInTheDocument();
  });

  test("4. User can type in email input", () => {
    renderWithRouter(<SignIn />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  test("5. User can type in password input", () => {
    renderWithRouter(<SignIn />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput).toHaveValue("password123");
  });

  test("6. Password toggle button is present", () => {
    renderWithRouter(<SignIn />);
    const toggleButtons = screen.getAllByRole("button", { name: "" });
    expect(toggleButtons.length).toBeGreaterThan(0);
  });

  test("7. Sign In button is displayed", () => {
    renderWithRouter(<SignIn />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  test("8. Forgot password link is present", () => {
    renderWithRouter(<SignIn />);
    const forgotLink = screen.getByText("Forgot password?");
    expect(forgotLink).toBeInTheDocument();
  });

  test("9. Sign up link is present", () => {
    renderWithRouter(<SignIn />);
    const signUpLink = screen.getByText("Sign up");
    expect(signUpLink).toBeInTheDocument();
  });

  test("10. Logo image is displayed", () => {
    renderWithRouter(<SignIn />);
    const logo = screen.getByAltText("Nodus");
    expect(logo).toBeInTheDocument();
  });
});
