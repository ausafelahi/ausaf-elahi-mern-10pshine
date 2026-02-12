import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ResetPassword from "@/pages/auth/ResetPassword";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { email: "test@example.com", otp: "123456" } }),
}));

jest.mock("@/services/api");
jest.mock("react-hot-toast");

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ResetPassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. ResetPassword component renders without crashing", () => {
    renderWithRouter(<ResetPassword />);
    const heading = screen.getByRole("heading", { name: /reset password/i });
    expect(heading).toBeInTheDocument();
  });

  test("2. New password input field is present", () => {
    renderWithRouter(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText("Enter new password");
    expect(newPasswordInput).toBeInTheDocument();
  });

  test("3. Confirm password input field is present", () => {
    renderWithRouter(<ResetPassword />);
    const confirmInput = screen.getByPlaceholderText("Confirm new password");
    expect(confirmInput).toBeInTheDocument();
  });

  test("4. User can type in new password input", () => {
    renderWithRouter(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText("Enter new password");
    fireEvent.change(newPasswordInput, { target: { value: "newpass123" } });
    expect(newPasswordInput).toHaveValue("newpass123");
  });

  test("5. User can type in confirm password input", () => {
    renderWithRouter(<ResetPassword />);
    const confirmInput = screen.getByPlaceholderText("Confirm new password");
    fireEvent.change(confirmInput, { target: { value: "newpass123" } });
    expect(confirmInput).toHaveValue("newpass123");
  });

  test("6. Reset Password button is displayed", () => {
    renderWithRouter(<ResetPassword />);
    const resetButton = screen.getByRole("button", { name: /reset password/i });
    expect(resetButton).toBeInTheDocument();
  });

  test("7. Password requirement text is displayed", () => {
    renderWithRouter(<ResetPassword />);
    const requirement = screen.getByText("Must be at least 8 characters long");
    expect(requirement).toBeInTheDocument();
  });

  test("8. Both password inputs have minLength of 8", () => {
    renderWithRouter(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText("Enter new password");
    const confirmInput = screen.getByPlaceholderText("Confirm new password");
    expect(newPasswordInput).toHaveAttribute("minLength", "8");
    expect(confirmInput).toHaveAttribute("minLength", "8");
  });

  test("9. Lock icon is displayed", () => {
    const { container } = renderWithRouter(<ResetPassword />);
    const lockIcon = container.querySelector(".lucide-lock");
    expect(lockIcon).toBeInTheDocument();
  });

  test("10. Instruction text is displayed", () => {
    renderWithRouter(<ResetPassword />);
    const instruction = screen.getByText("Enter your new password below");
    expect(instruction).toBeInTheDocument();
  });

  test("11. Password toggle buttons are present", () => {
    renderWithRouter(<ResetPassword />);
    const toggleButtons = screen.getAllByRole("button", { name: "" });
    expect(toggleButtons.length).toBeGreaterThanOrEqual(2);
  });
});
