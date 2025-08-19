"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent default submit
    const form = event.target;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setLoading(true);
    setError(""); // clear old error

    try {
      const response = await axios.post(
        `https://authentication-backend-5s9c.onrender.com/api/signup`,
        { name, email, password }
      );

      setMessage(response.data.message)
      // Only redirect if status is 200
      if (response.status === 200) {
       setTimeout(() => {
         router.push("/verification");
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
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <h2 className="signup-title">Create an Account</h2>

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              className="form-input"
              placeholder="Enter your name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              className="form-input"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              title="Password must be at least 6 characters and contain a special character"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="password-hint">
              Password must be at least 6 characters and contain a special
              character.
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="error">{error}</p>}
{message && <p className="response">{message}</p>}
          {/* Signup Button */}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" aria-label="Loading"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
