"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NoteEditor = () => {
  const { id } = useParams();
  const isNew = id === "New";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"Idle" | "Saving" | "Error">("Idle");

  useEffect(() => {
    if (!isNew) {
      setTitle("Sample Note");
      setContent("This is a sample note content.");
    }
  }, [isNew]);

  const handleSave = () => {
    setStatus("Saving");
    setTimeout(() => {
      console.log({
        id: isNew ? "New" : id,
        title,
        content,
      });
      setStatus("Idle");
    }, 800);
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {isNew ? "Create New Note" : "Edit Note"}
        </h1>
        <Button
          onClick={handleSave}
          disabled={status === "Saving"}
          className="bg-teal-500 hover:bg-teal-600"
        >
          {status === "Saving" ? "Saving..." : "Save"}
        </Button>
      </div>
      <div className="space-y-4">
        <Input
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Start Writing Ideas..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-75"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
