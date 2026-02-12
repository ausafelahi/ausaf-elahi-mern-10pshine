import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "@/pages/auth/SignUp";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("@/services/api");
jest.mock("react-hot-toast");

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. SignUp component renders without crashing", () => {
    renderWithRouter(<SignUp />);
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  test("2. Full Name input field is present", () => {
    renderWithRouter(<SignUp />);
    const nameInput = screen.getByPlaceholderText("John Doe");
    expect(nameInput).toBeInTheDocument();
  });

  test("3. Email input field is present", () => {
    renderWithRouter(<SignUp />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toBeInTheDocument();
  });

  test("4. Password input fields are present", () => {
    renderWithRouter(<SignUp />);
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    expect(passwordInputs).toHaveLength(2);
  });

  test("5. User can type in name input", () => {
    renderWithRouter(<SignUp />);
    const nameInput = screen.getByPlaceholderText("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    expect(nameInput).toHaveValue("Jane Doe");
  });

  test("6. Terms checkbox is present", () => {
    renderWithRouter(<SignUp />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("7. Sign Up button is displayed", () => {
    renderWithRouter(<SignUp />);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
  });

  test("8. Sign in link is present", () => {
    renderWithRouter(<SignUp />);
    const signInLink = screen.getByText("Sign in");
    expect(signInLink).toBeInTheDocument();
  });

  test("9. Password requirement text is displayed", () => {
    renderWithRouter(<SignUp />);
    const requirement = screen.getByText("Must be at least 8 characters");
    expect(requirement).toBeInTheDocument();
  });

  test("10. Terms of Service link is present", () => {
    renderWithRouter(<SignUp />);
    const termsLink = screen.getByText("Terms of Service");
    expect(termsLink).toBeInTheDocument();
  });
});
