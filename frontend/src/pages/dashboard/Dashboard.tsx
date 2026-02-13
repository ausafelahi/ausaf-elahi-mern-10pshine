"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { fetchNotes, deleteNote, togglePin } from "@/services/noteApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router-dom";
import { Pin, Edit2, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

type Note = {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  color: string;
  tags?: string[];
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadNotes = async (tag?: string, search?: string) => {
    try {
      const params: any = {};
      if (tag) params.tag = tag;
      if (search) params.search = search;
      const notesRes = await fetchNotes(
        Object.keys(params).length ? params : undefined,
      );
      setNotes(notesRes.data);
    } catch (error) {
      toast.error("Failed to load notes");
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
        await loadNotes();
      } catch {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [navigate]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      loadNotes(selectedTag || undefined, searchQuery || undefined);
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery, selectedTag]);

  const handlePin = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await togglePin(id);
      toast.success("Pin status updated");
      await loadNotes(selectedTag || undefined, searchQuery || undefined);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update pin");
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/notes/${id}`);
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    try {
      await deleteNote(noteToDelete);
      toast.success("Note deleted");
      await loadNotes(selectedTag || undefined, searchQuery || undefined);
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleTagFilter = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    loadNotes(newTag || undefined, searchQuery || undefined);
  };

  if (loading) {
    return (
      <div className="max-w-6xl px-4 py-10 mx-auto">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);
  const displayNotes = showPinnedOnly ? pinnedNotes : notes;
  const sortedNotes = [...displayNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));

  const NoteCard = ({ note }: { note: Note }) => (
    <div
      key={note._id}
      className="relative p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow group"
      style={{ backgroundColor: note.color || "#fff" }}
    >
      {note.isPinned && (
        <Pin className="absolute top-2 right-2 w-4 h-4 fill-teal-500 text-teal-500" />
      )}

      <div onClick={() => navigate(`/notes/${note._id}`)}>
        <h3 className="font-semibold pr-8 mb-2">{note.title}</h3>
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            {note.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div
          className="mt-2 text-sm line-clamp-3"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => handlePin(e, note._id)}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            note.isPinned ? "text-teal-500" : "text-gray-600"
          }`}
          title={note.isPinned ? "Unpin" : "Pin"}
        >
          <Pin className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => handleEdit(e, note._id)}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => confirmDelete(e, note._id)}
          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl px-4 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            Manage your notes and ideas in one place
          </p>
        </div>
        <Link to="/notes/new">
          <Button className="bg-teal-500 hover:bg-teal-600">New Note</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        {allTags.length > 0 && (
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">Filter by Tag:</h3>
            <div className="flex gap-2 flex-wrap">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900"
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {pinnedNotes.length > 0 && (
          <Button
            variant={showPinnedOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            className="ml-4"
          >
            <Pin className="w-4 h-4 mr-2" />
            {showPinnedOnly ? "Show All" : `Pinned (${pinnedNotes.length})`}
          </Button>
        )}
      </div>

      {!showPinnedOnly && pinnedNotes.length > 0 && unpinnedNotes.length > 0 ? (
        <>
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <Pin className="w-5 h-5 text-teal-500" />
              Pinned Notes ({pinnedNotes.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pinnedNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">
              Other Notes ({unpinnedNotes.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unpinnedNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            {showPinnedOnly ? "Pinned Notes" : "Your Notes"}
          </h2>
          {sortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
              <p className="mb-4 text-muted-foreground">
                {searchQuery || selectedTag
                  ? "No notes found"
                  : "No Notes. Start by creating your first note!"}
              </p>
              <Link to="/notes/new">
                <Button variant="outline">Create your first note</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          )}
        </section>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
