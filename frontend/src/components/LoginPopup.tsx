import { useState } from "react";
import { login } from "../api/profileService";
import type { UserProfile } from "../api/profileService";

interface LoginPopupProps {
  onLogin: (profile: UserProfile) => void;
}

const LoginPopup = ({ onLogin }: LoginPopupProps) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (username.trim() === "") {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const profile = await login(username.trim());
      localStorage.setItem("userId", String(profile.id));
      onLogin(profile);
    } catch {
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <h2 className="login-title">Nutrition Tracker</h2>
        <p className="login-subtitle">Enter a username to get started</p>

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {error && <p className="login-error">{error}</p>}

        <button className="login-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;