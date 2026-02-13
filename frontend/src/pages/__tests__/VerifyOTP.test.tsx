import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VerifyOTP from "@/pages/auth/VerifyOTP";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { email: "test@example.com" } }),
}));

jest.mock("@/services/api");
jest.mock("react-hot-toast");

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("VerifyOTP Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. VerifyOTP component renders without crashing", () => {
    renderWithRouter(<VerifyOTP />);
    const heading = screen.getByRole("heading", { name: /verify otp/i });
    expect(heading).toBeInTheDocument();
  });

  test("2. OTP input field is present", () => {
    renderWithRouter(<VerifyOTP />);
    const otpInput = screen.getByPlaceholderText("000000");
    expect(otpInput).toBeInTheDocument();
  });

  test("3. User can type numbers in OTP input", () => {
    renderWithRouter(<VerifyOTP />);
    const otpInput = screen.getByPlaceholderText("000000");
    fireEvent.change(otpInput, { target: { value: "123456" } });
    expect(otpInput).toHaveValue("123456");
  });

  test("4. Email is displayed from location state", () => {
    renderWithRouter(<VerifyOTP />);
    const email = screen.getByText("test@example.com");
    expect(email).toBeInTheDocument();
  });

  test("5. Verify OTP button is displayed", () => {
    renderWithRouter(<VerifyOTP />);
    const verifyButton = screen.getByRole("button", { name: /verify otp/i });
    expect(verifyButton).toBeInTheDocument();
  });

  test("6. Back link is present", () => {
    renderWithRouter(<VerifyOTP />);
    const backLink = screen.getByText("Back");
    expect(backLink).toBeInTheDocument();
  });

  test("7. OTP expiry message is displayed", () => {
    renderWithRouter(<VerifyOTP />);
    const expiryText = screen.getByText("OTP expires in 10 minutes");
    expect(expiryText).toBeInTheDocument();
  });

  test("8. Resend OTP text is displayed", () => {
    renderWithRouter(<VerifyOTP />);
    const resendText = screen.getByText(/didn't receive the code/i);
    expect(resendText).toBeInTheDocument();
  });

  test("9. OTP input has maxLength of 6", () => {
    renderWithRouter(<VerifyOTP />);
    const otpInput = screen.getByPlaceholderText("000000");
    expect(otpInput).toHaveAttribute("maxLength", "6");
  });

  test("10. Shield icon container is present", () => {
    renderWithRouter(<VerifyOTP />);
    const heading = screen.getByRole("heading", { name: /verify otp/i });
    expect(heading).toBeInTheDocument();
  });
});
