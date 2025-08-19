"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const VerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  const router = useRouter();

  const handleotp = async (e) => {
    e.preventDefault(); // prevent page reload on submit
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `https://authentication-backend-5s9c.onrender.com/api/sendverifycode`,
        { code }
      );


      setMessage(response.data.message);

      // ✅ Correct check: use response.status
      if (response.status === 200) {
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      // console.log("API Error:", err.response?.data);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
              <button type="button" className="resend-btn">
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
