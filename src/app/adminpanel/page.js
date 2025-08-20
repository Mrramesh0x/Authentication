"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [emails, setEmails] = useState([]); // ✅ store emails
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await axios.get(
          "https://authentication-backend-5s9c.onrender.com/api/admin/active-users",
          { withCredentials: true } // ✅ cookie-based
        );

        setActiveUsers(res.data.activeUsers);
        setEmails(res.data.emails || []); // ✅ update emails
      } catch (err) {
        console.error("Admin error:", err.response?.data || err.message);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
  }, [router]);

  if (loading) {
    return <p>Loading admin data...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Admin Dashboard</h1>
      <p>
        Currently Active Users: <strong>{activeUsers}</strong>
      </p>

      <h2>📧 Active User Emails</h2>
      {emails.length > 0 ? (
        <ul>
          {emails.map((email, idx) => (
            <li key={idx}>{email}</li>
          ))}
        </ul>
      ) : (
        <p>No active users right now.</p>
      )}
    </div>
  );
}
