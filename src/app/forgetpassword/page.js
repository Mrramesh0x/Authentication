"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start spinner

    try {
      const res = await fetch(`https://authentication-backend-5s9c.onrender.com//api/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("resetEmail", email);
        toast.success("OTP sent successfully!");
        router.push("/verifyotp");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false); // stop spinner
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Forgot Password</h2>
        
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          type="email"
          className="auth-input"
          required
        />

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Send OTP"} 
        </button>
      </form>

      {/* ✅ Toast container */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        draggable 
      />
    </div>
  );
}
