"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await axios.get(
          "https://authentication-backend-5s9c.onrender.com/api/admin/active-users",
          { withCredentials: true } // send cookies (JWT)
        );
        setActiveUsers(res.data.activeUsers);
      } catch (err) {
        console.error("Admin error:", err.response?.data || err.message);

        // if not logged in or not admin → kick out
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
  }, [router]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>
        Currently Active Users: <strong>{activeUsers}</strong>
      </p>
    </div>
  );
}
