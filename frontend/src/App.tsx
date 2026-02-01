import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Home";
import NoteEditor from "./pages/notes/NoteEditor";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

function App() {
  const location = useLocation();

  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <>
      {isAuthRoute ? (
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes/:id" element={<NoteEditor />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
