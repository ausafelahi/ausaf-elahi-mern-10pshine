import { Navigate, Outlet } from "react-router-dom";
import React from "react";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
