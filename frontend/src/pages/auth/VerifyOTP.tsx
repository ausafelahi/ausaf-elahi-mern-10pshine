"use client";
import { useState } from "react";
import api from "@/services/api";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const { state }: any = useLocation();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/auth/verify-otp", {
      email: state.email,
      otp,
    });

    toast.success("OTP verified successfully");
    navigate("/reset-password", { state: { email: state.email, otp } });
  };

  return (
    <form onSubmit={submit}>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default VerifyOTP;
