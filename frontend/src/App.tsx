import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Home";
import NoteEditor from "./pages/notes/NoteEditor";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes/:id" element={<NoteEditor />} />
      </Routes>
    </Layout>
  );
}

export default App;
