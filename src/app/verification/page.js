"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const VerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ page protection
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  const router = useRouter();

  // ✅ Protect route on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://authentication-backend-5s9c.onrender.com/api/check-auth",
          { withCredentials: true } // send cookie
        );

        if (!res.data.user) {
          router.push("/login");
        } else {
          setCheckingAuth(false); // allow access
        }
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleotp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `https://authentication-backend-5s9c.onrender.com/api/sendverifycode`,
        { code },
        { withCredentials: true }
      );

      setMessage(response.data.message);

      if (response.status === 200) {
        setTimeout(() => {
          router.push("/login");
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

  // ✅ While checking authentication, show a loader
  if (checkingAuth) return <p>Checking authentication...</p>;

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
      </div>
    </div>
  );
};

export default VerificationPage;
