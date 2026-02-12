"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import { fetchNoteById, createNote, updateNote } from "@/services/noteApi";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#fecaca" },
  { name: "Orange", value: "#fed7aa" },
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Purple", value: "#e9d5ff" },
  { name: "Pink", value: "#fbcfe8" },
];

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id?.toLowerCase() === "new";

  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [status, setStatus] = useState<"Idle" | "Saving" | "Error">("Idle");

  useEffect(() => {
    if (!isNew && id) {
      setStatus("Saving");
      fetchNoteById(id)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setTags(res.data.tags || []);
          setColor(res.data.color || "#ffffff");
          setStatus("Idle");
        })
        .catch(() => {
          setStatus("Error");
          toast.error("Failed to load note");
          navigate("/dashboard");
        });
    }
  }, [id, isNew, navigate]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      setStatus("Saving");

      const noteData = {
        title,
        content,
        tags,
        color,
        isPinned: false,
      };

      if (isNew) {
        await createNote(noteData);
        toast.success("Note created!");
        navigate("/dashboard", { replace: true });
      } else if (id) {
        await updateNote(id, noteData);
        toast.success("Note updated!");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setStatus("Error");
      toast.error("Failed to save note");
    }
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {isNew ? "Create New Note" : "Edit Note"}
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            disabled={status === "Saving"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={status === "Saving"}
            className="bg-teal-500 hover:bg-teal-600"
          >
            {status === "Saving" ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Note Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setColor(colorOption.value)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  color === colorOption.value
                    ? "border-teal-500 scale-110 shadow-md"
                    : "border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <div className="border rounded-lg overflow-hidden">
            <JoditEditor
              ref={editorRef}
              value={content}
              onBlur={(newContent: string) => setContent(newContent)}
              onChange={() => {}}
              config={{
                readonly: false,
                height: 400,
                placeholder: "Start writing your ideas...",
                toolbarButtonSize: "small",
                buttons: [
                  "bold",
                  "italic",
                  "underline",
                  "|",
                  "ul",
                  "ol",
                  "|",
                  "link",
                  "|",
                  "align",
                  "|",
                  "undo",
                  "redo",
                ],
              }}
            />
          </div>
        </div>

        {status === "Error" && (
          <p className="text-sm text-red-500">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
