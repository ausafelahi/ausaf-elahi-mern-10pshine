"use client";
import { useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    toast.success("OTP sent to your email");
    navigate("/verify-otp", { state: { email } });
  };

  return (
    <form onSubmit={submit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Send OTP</button>
    </form>
  );
};

export default ForgotPassword;
