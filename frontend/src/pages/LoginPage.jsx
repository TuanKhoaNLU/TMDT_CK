import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAdminUsers } from "../api.js";
import { useAuth } from "../context/useAuth.js";

const MOCK_ACCOUNTS = [
  { id: 3, label: "Buyer - Elon Musk" },
  { id: 1, label: "Seller - Khoa Pham" },
  { id: 2, label: "Seller - Khang Pham" },
  { id: 4, label: "Admin" },
];

const DEMO_EMAILS = [
  "khoa@gmail.com",
  "khang@gmail.com",
  "elon@gmail.com",
  "admin@test.com",
];

const ROLE_REDIRECT = {
  BUYER: "/",
  SELLER: "/seller",
  ADMIN: "/admin",
};

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loginByUser = (target) => {
    login(target);
    if (target.role === "ADMIN") {
      navigate("/admin");
      return;
    }
    navigate(fromPath ?? ROLE_REDIRECT[target.role] ?? "/");
  };

  const handleQuickLogin = async (accountId) => {
    setError("");
    setSubmitting(true);
    try {
      const users = await fetchAdminUsers();
      const target = users.find((u) => u.id === accountId);
      if (!target) {
        setError("Khong tim thay tai khoan tren server.");
        return;
      }
      loginByUser(target);
    } catch {
      setError("Khong ket noi duoc server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setError("Vui long nhap email.");
      return;
    }
    if (!form.password) {
      setError("Vui long nhap mat khau (mock - nhap gi cung duoc).");
      return;
    }
    setSubmitting(true);
    try {
      const users = await fetchAdminUsers();
      const target = users.find((u) => u.email.toLowerCase() === email);
      if (!target) {
        setError("Khong tim thay user voi email nay.");
        return;
      }
      loginByUser(target);
    } catch {
      setError("Khong ket noi duoc server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container login-container">
      <h1>Welcome</h1>
      <p className="muted">
        Dang nhap bang email co san. Mock auth chua kiem tra mat khau.
      </p>
      <form className="panel" onSubmit={handleSubmit}>
        <input
          placeholder="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
        />
        <button className="btn full-width" type="submit" disabled={submitting}>
          {submitting ? "Dang xu ly..." : "Sign In"}
        </button>
        <p className="muted small mt-8">
          Email demo co the dung:
        </p>
        <ul className="muted small demo-emails">
          {DEMO_EMAILS.map((e) => (
            <li key={e}>
              <code>{e}</code>
            </li>
          ))}
        </ul>
      </form>
      <div className="panel mt-8">
        <h3>Quick login</h3>
        <p className="muted small">Bam de dang nhap nhanh khong can email.</p>
        <div className="role-grid">
          {MOCK_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              className="btn ghost role-btn"
              onClick={() => handleQuickLogin(acc.id)}
              disabled={submitting}
            >
              {acc.label}
            </button>
          ))}
        </div>
        {error && <p className="muted mt-8">{error}</p>}
        {user && (
          <p className="muted mt-8">
            Dang dang nhap: <strong>{user.fullName}</strong> ({user.role}
            {user.shopId ? ` - Shop #${user.shopId}` : ""})
          </p>
        )}
      </div>
    </main>
  );
}
