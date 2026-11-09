import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const API_URL = "http://localhost:3000/api";

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const email = form.email.trim().toLowerCase();

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We couldn't create your account. Please try again.");
      }

      setSuccess("Your account has been created. Redirecting you to sign in...");
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.message || "Unable to connect to StockPilot. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signup-title">
        <button
          type="button"
          className="signup-logo"
          onClick={() => navigate("/")}
          aria-label="StockPilot home"
        >
          Stock<span>pilot</span>
        </button>

        <div className="signup-heading">
          <p className="signup-eyebrow">CREATE YOUR ACCOUNT</p>
          <h1 id="signup-title">Join StockPilot</h1>
          <p>Sign up to shop our collection and keep track of your orders.</p>
        </div>

        {error && <div className="signup-message signup-error" role="alert">{error}</div>}
        {success && <div className="signup-message signup-success" role="status">{success}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField}
              maxLength={254}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={updateField}
              minLength={8}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-confirm-password">Confirm password</label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your password again"
              value={form.confirmPassword}
              onChange={updateField}
              minLength={8}
              required
            />
          </div>

          <label className="signup-show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Show password
          </label>

          <button className="signup-submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="signup-login">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <button type="button" className="signup-back" onClick={() => navigate("/")}>
          ← Back to store
        </button>
      </section>
    </main>
  );
}

export default SignUp;
