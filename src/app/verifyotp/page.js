"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (!savedEmail) router.push("/forgetpassword");
    setEmail(savedEmail || "");
  }, [router]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start spinner

    try {
      const res = await fetch(
        `https://authentication-backend-5s9c.onrender.com/api/check-reset-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("resetOtp", otp);
        toast.success("OTP verified");
         setTimeout(() => {
        router.push("/changepassword");
      }, 4000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false); // stop spinner
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleVerify}>
        <h2 className="auth-title">Verify OTP</h2>
        <input
          className="auth-input"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Verify"}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </form>
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
