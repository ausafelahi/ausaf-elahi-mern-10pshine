"use client";
import { useState } from "react";
import api from "@/services/api";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { state }: any = useLocation();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/auth/reset-password", {
      email: state.email,
      otp: state.otp,
      newPassword: password,
    });
    toast.success("Password reset successful");
    navigate("/login");
  };

  return (
    <form onSubmit={submit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
