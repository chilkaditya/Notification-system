import { useState } from "react";
import "./App.css";

const BACKEND_URL = "http://localhost:3000";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const signIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed");
        return;
      }

      setToken(data.token);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadProfile = async () => {
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load profile");
        return;
      }

      setProfile(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Simple Auth Demo</h1>

      <form onSubmit={signIn} className="card">
        <h2>Sign In</h2>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button type="submit">Sign In</button>
      </form>

      {token && (
        <div className="card">
          <h2>Token</h2>
          <pre className="token">{token}</pre>
          <button onClick={loadProfile}>Load Profile</button>
        </div>
      )}

      {profile && (
        <div className="card">
          <h2>Profile (protected)</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="card error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <p className="small">
        This app calls <code>{BACKEND_URL}</code> (your backend) using the token
        returned from /signin.
      </p>
    </div>
  );
}

export default App;
