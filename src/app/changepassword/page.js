"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    const savedOtp = localStorage.getItem("resetOtp");
    if (!savedEmail || !savedOtp) router.push("/forgotpassword");
    setEmail(savedEmail || "");
    setOtp(savedOtp || "");
  }, [router]);

 const handleChangePassword = async (e) => {
  e.preventDefault();
  setError("");

  // ✅ Validation: check empty fields
  if (!password || !confirm) {
    setError("Please fill in both password fields");
    return;
  }

  // ✅ Validation: check if passwords match
  if (password !== confirm) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(
      `https://authentication-backend-5s9c.onrender.com/api/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          password,
          confirmPassword: confirm,
        }),
      }
    );
    const data = await res.json();

    if (res.ok) {
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      toast.success("Password changed successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 4000);
    } else {
      setError(data.message || "Password change failed");
    }
  } catch {
    setError("Server error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleChangePassword}>
        <h2 className="auth-title">Change Password</h2>

        <input
          type="password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
        />

        <input
          type="password"
          className="auth-input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm Password"
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Change Password"}
        </button>
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
