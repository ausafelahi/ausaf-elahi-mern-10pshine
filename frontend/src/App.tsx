import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import NoteEditor from "./pages/notes/NoteEditor";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const location = useLocation();

  const authRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ];

  const isAuthRoute = authRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <>
      {isAuthRoute ? (
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes/:id" element={<NoteEditor />} />
            </Route>
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
