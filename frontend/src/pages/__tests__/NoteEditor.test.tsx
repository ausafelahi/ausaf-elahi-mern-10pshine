import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoteEditor from "@/pages/notes/NoteEditor";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "new" }),
}));

jest.mock("@/services/noteApi");
jest.mock("react-hot-toast");
jest.mock("jodit-react", () => ({
  __esModule: true,
  default: ({ value, onBlur }: any) => (
    <textarea
      data-testid="jodit-editor"
      value={value}
      onBlur={(e) => onBlur(e.target.value)}
      onChange={() => {}}
    />
  ),
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <NoteEditor />
    </BrowserRouter>,
  );
};

describe("NoteEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. Component renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Create New Note")).toBeInTheDocument();
  });

  test("2. Title input field is present", () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText("Enter note title...");
    expect(titleInput).toBeInTheDocument();
  });

  test("3. User can type in title input", () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText("Enter note title...");
    fireEvent.change(titleInput, { target: { value: "My Test Note" } });
    expect(titleInput).toHaveValue("My Test Note");
  });

  test("4. All 8 color options are displayed", () => {
    renderComponent();
    const colorButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("title") && btn.style.backgroundColor);
    expect(colorButtons.length).toBe(8);
  });

  test("5. Tag input field is present", () => {
    renderComponent();
    const tagInput = screen.getByPlaceholderText("Add a tag and press Enter");
    expect(tagInput).toBeInTheDocument();
  });

  test("6. User can type in tag input", () => {
    renderComponent();
    const tagInput = screen.getByPlaceholderText("Add a tag and press Enter");
    fireEvent.change(tagInput, { target: { value: "important" } });
    expect(tagInput).toHaveValue("important");
  });

  test("7. Cancel button is displayed", () => {
    renderComponent();
    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();
  });

  test("8. Save button is displayed", () => {
    renderComponent();
    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeInTheDocument();
  });

  test("9. Content editor is present", () => {
    renderComponent();
    const editor = screen.getByTestId("jodit-editor");
    expect(editor).toBeInTheDocument();
  });

  test("10. Default note color is white (#ffffff)", () => {
    renderComponent();
    const whiteColorButton = screen.getByTitle("White");
    expect(whiteColorButton).toHaveClass("border-teal-500");
  });
});
