import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    const res = await login(form.email, form.password);
    if (res.success) navigate(from, { replace: true });
  };

  const fillDemo = (role) => {
    if (role === "admin") setForm({ email: "alex@example.com", password: "password123" });
    else setForm({ email: "sarah@example.com", password: "sarah456" });
    setFormErrors({});
    clearError();
  };

  return (
    <main className="auth-page page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo">⚡ ShopNest</Link>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Demo Buttons */}
          <div className="auth-demos">
            <p>Quick demo login:</p>
            <div className="auth-demos__btns">
              <button className="btn btn-secondary btn-sm" onClick={() => fillDemo("user")}>👤 Demo User</button>
              <button className="btn btn-secondary btn-sm" onClick={() => fillDemo("admin")}>⚙️ Demo Admin</button>
            </div>
          </div>

          <div className="auth-divider"><span>or sign in manually</span></div>

          {/* Error Banner */}
          {error && (
            <div className="auth-error-banner">
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-input ${formErrors.email ? "error" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setFormErrors((fe) => ({ ...fe, email: "" })); }}
                autoComplete="email"
              />
              {formErrors.email && <span className="auth-field-error">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${formErrors.password ? "error" : ""}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); setFormErrors((fe) => ({ ...fe, password: "" })); }}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {formErrors.password && <span className="auth-field-error">{formErrors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one →</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
