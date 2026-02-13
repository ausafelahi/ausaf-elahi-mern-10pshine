import {
  fetchNotes,
  fetchNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
} from "../noteApi";

import api from "../api";

jest.mock("../api");

const mockedApi = api as jest.Mocked<typeof api>;

describe("Notes API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch notes with search and tag query params", async () => {
    mockedApi.get.mockResolvedValue({
      data: [{ id: "1", title: "Test Note" }],
    });

    const result = await fetchNotes({
      search: "hello",
      tag: "work",
    });

    expect(mockedApi.get).toHaveBeenCalledWith("/notes?search=hello&tag=work");
    expect(result).toEqual([{ id: "1", title: "Test Note" }]);
  });

  it("should fetch a single note by id", async () => {
    mockedApi.get.mockResolvedValue({
      data: { id: "123", title: "Note 123" },
    });

    const result = await fetchNoteById("123");

    expect(mockedApi.get).toHaveBeenCalledWith("/notes/123");
    expect(result).toEqual({ id: "123", title: "Note 123" });
  });

  it("should create a new note", async () => {
    const payload = {
      title: "New Note",
      content: "Some content",
      tags: ["work"],
    };

    mockedApi.post.mockResolvedValue({
      data: { id: "1", ...payload },
    });

    const result = await createNote(payload);

    expect(mockedApi.post).toHaveBeenCalledWith("/notes", payload);
    expect(result).toEqual({ id: "1", ...payload });
  });

  it("should update a note by id", async () => {
    const payload = { title: "Updated Title" };

    mockedApi.put.mockResolvedValue({
      data: { id: "1", ...payload },
    });

    const result = await updateNote("1", payload);

    expect(mockedApi.put).toHaveBeenCalledWith("/notes/1", payload);
    expect(result).toEqual({ id: "1", ...payload });
  });

  it("should delete a note by id", async () => {
    mockedApi.delete.mockResolvedValue({
      data: { message: "Deleted successfully" },
    });

    const result = await deleteNote("1");

    expect(mockedApi.delete).toHaveBeenCalledWith("/notes/1");
    expect(result).toEqual({ message: "Deleted successfully" });
  });

  it("should toggle pin status of a note", async () => {
    mockedApi.patch.mockResolvedValue({
      data: { id: "1", isPinned: true },
    });

    const result = await togglePin("1");

    expect(mockedApi.patch).toHaveBeenCalledWith("/notes/1/pin");
    expect(result).toEqual({ id: "1", isPinned: true });
  });
});
