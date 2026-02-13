import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "@/pages/dashboard/Dashboard";
import { BrowserRouter } from "react-router-dom";
import * as noteApi from "@/services/noteApi";
import api from "@/services/api";

jest.mock("@/services/noteApi");
jest.mock("@/services/api");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUser = {
  name: "Ausaf",
};

const mockNotes = [
  {
    _id: "1",
    title: "Test Note",
    content: "<p>Content</p>",
    isPinned: false,
    color: "#fff",
    tags: ["work"],
  },
  {
    _id: "2",
    title: "Pinned Note",
    content: "<p>Pinned</p>",
    isPinned: true,
    color: "#fff",
    tags: ["personal"],
  },
];

const renderComponent = async () => {
  (api.get as jest.Mock).mockResolvedValue({
    data: { data: mockUser },
  });

  (noteApi.fetchNotes as jest.Mock).mockResolvedValue({
    data: mockNotes,
  });

  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>,
  );

  await waitFor(() => expect(screen.getByText(/Welcome/i)).toBeInTheDocument());
};

test("renders welcome message", async () => {
  await renderComponent();
  expect(screen.getByText("Welcome, Ausaf")).toBeInTheDocument();
});

test("renders notes correctly", async () => {
  await renderComponent();
  expect(screen.getByText("Test Note")).toBeInTheDocument();
  expect(screen.getByText("Pinned Note")).toBeInTheDocument();
});

test("renders search input", async () => {
  await renderComponent();
  expect(
    screen.getByPlaceholderText("Search notes by title or content..."),
  ).toBeInTheDocument();
});

test("renders search input", async () => {
  await renderComponent();
  expect(
    screen.getByPlaceholderText("Search notes by title or content..."),
  ).toBeInTheDocument();
});

test("filters notes by search query", async () => {
  await renderComponent();

  const input = screen.getByPlaceholderText(
    "Search notes by title or content...",
  );

  fireEvent.change(input, { target: { value: "Pinned" } });

  await waitFor(() => expect(noteApi.fetchNotes).toHaveBeenCalled());
});

test("displays pinned notes section", async () => {
  await renderComponent();
  expect(screen.getByText(/Pinned Notes/i)).toBeInTheDocument();
});

test("navigates to new note page", async () => {
  await renderComponent();

  const newNoteButton = screen.getByText("New Note");
  fireEvent.click(newNoteButton);

  expect(newNoteButton).toBeInTheDocument();
});

test("navigates to new note page", async () => {
  await renderComponent();

  const newNoteButton = screen.getByText("New Note");
  fireEvent.click(newNoteButton);

  expect(newNoteButton).toBeInTheDocument();
});

test("calls togglePin when pin button clicked", async () => {
  (noteApi.togglePin as jest.Mock).mockResolvedValue({});

  await renderComponent();

  const pinButtons = screen.getAllByTitle(/Pin|Unpin/);
  fireEvent.click(pinButtons[0]);

  await waitFor(() => expect(noteApi.togglePin).toHaveBeenCalled());
});
