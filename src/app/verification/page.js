"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  // 🔹 Protect route: if no signup email, redirect to signup
  useEffect(() => {
    const savedEmail = localStorage.getItem("signupEmail");
    if (!savedEmail) {
      router.push("/signup");
    } else {
      setEmail(savedEmail);
    }
  }, [router]);

  const handleotp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `https://authentication-backend-5s9c.onrender.com/api/sendverifycode`,
        { code, email } // ✅ send email with code
      );

      setMessage(response.data.message);

      if (response.status === 200) {
        // clear email from localStorage after success
        localStorage.removeItem("signupEmail");

        setTimeout(() => {
          router.push("/login"); // ✅ redirect after success
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    toast.error("Otp is limited");
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleotp}>
          <h2 className="signup-title">Verify Your Account</h2>

          <div className="form-group otp-group">
            <label className="form-label" htmlFor="otp">
              Enter Verification Code
            </label>
            <div className="otp-input-wrapper">
              <input
                type="text"
                id="otp"
                name="otp"
                className="form-input otp-input"
                placeholder="Enter code"
                maxLength={6}
                required
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleResend}
                className="resend-btn"
              >
                Resend OTP
              </button>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p className="response">{message}</p>}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" aria-label="Loading"></span>
            ) : (
              "Verify"
            )}
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
};

export default VerificationPage;
