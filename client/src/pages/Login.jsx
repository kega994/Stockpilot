import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import BasketContext from "../context/BasketContext";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { syncGuestBasket } = useContext(BasketContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);

      // Merge guest basket and load customer's basket
      await syncGuestBasket();

      // Return to the page the customer originally wanted
      const destination = location.state?.from || "/";

      navigate(destination, { replace: true });

    } catch (error) {
      console.error("Login failed:", error);

      // Remove token if basket synchronisation failed
      localStorage.removeItem("token");

      setError(error.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div
          className="login-logo"
          onClick={() => navigate("/")}
        >
          Stock<span>pilot</span>
        </div>

        <div className="login-header">
          <p className="login-label">ADMIN PORTAL</p>

          <h1>Welcome back</h1>

          <p className="login-description">
            Sign in to manage your products and inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <button
          type="button"
          className="back-home-button"
          onClick={() => navigate("/")}
        >
          ← Back to store
        </button>

      </div>
    </div>
  );
}

export default Login;