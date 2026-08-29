import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorBanner from "../components/ErrorBanner";

export default function Signup() {
  const { signup, authError, authLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await signup(form);
    if (ok) navigate("/dashboard", { replace: true });
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} aria-label="Create an account">
        <h1>Create Your FitTrack Account</h1>
        <ErrorBanner message={authError} />

        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={authLoading}>
          {authLoading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
