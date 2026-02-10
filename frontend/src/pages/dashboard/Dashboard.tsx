"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };
    fetchMe();
  }, []);

  if (!user) return <p>Loading...</p>;
  return (
    <div className="max-w-6xl px-4 py-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
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

      <section>
        <h2 className="mb-4 text-xl font-semibold">Your Notes</h2>

        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed">
          <p className="mb-4 text-muted-foreground">
            No Notes. Start by creating your first note!
          </p>
          <Link to="/notes/new">
            <Button variant="outline">Create your first note</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
