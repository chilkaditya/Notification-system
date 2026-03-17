import { useState, useEffect } from "react";

const BACKEND_URL = "http://localhost:3000";

export default function Dashboard({ onLogout }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/user-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load user info");
        return;
      }

      setUserInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    onLogout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-box">
          <p>Error: {error}</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {userInfo && (
        <div className="dashboard-card">
          <div className="info-section">
            <h2>User Information</h2>
            <div className="info-item">
              <label>Email:</label>
              <span>{userInfo.email}</span>
            </div>
            <div className="info-item">
              <label>Login Count:</label>
              <span>{userInfo.login_count || 0}</span>
            </div>
            <div className="info-item">
              <label>Last Login:</label>
              <span>
                {userInfo.last_login
                  ? new Date(userInfo.last_login).toLocaleString()
                  : "Never"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
