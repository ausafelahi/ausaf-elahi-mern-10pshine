import api from "./api";

export const fetchNotes = async (params?: {
  search?: string;
  tag?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.tag) queryParams.append("tag", params.tag);

  const queryString = queryParams.toString();
  const response = await api.get(
    `/notes${queryString ? `?${queryString}` : ""}`,
  );
  return response.data; // axios already wraps in .data
};

export const fetchNoteById = async (id: string) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (payload: {
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
  color?: string;
}) => {
  const response = await api.post("/notes", payload);
  return response.data;
};

export const updateNote = async (
  id: string,
  payload: Partial<{
    title: string;
    content: string;
    tags: string[];
    isPinned: boolean;
    color: string;
  }>,
) => {
  const response = await api.put(`/notes/${id}`, payload);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const togglePin = async (id: string) => {
  const response = await api.patch(`/notes/${id}/pin`);
  return response.data;
};
