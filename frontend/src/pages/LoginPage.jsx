import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAdminUsers } from "../api.js";
import { useAuth } from "../context/useAuth.js";

const MOCK_ACCOUNTS = [
  { id: 3, label: "Người mua - Elon Musk" },
  { id: 1, label: "Người bán - Khoa Phạm" },
  { id: 2, label: "Người bán - Khang Phạm" },
  { id: 4, label: "Quản trị viên" },
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
        setError("Không tìm thấy tài khoản trên máy chủ.");
        return;
      }
      loginByUser(target);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    if (!form.password) {
      setError("Vui lòng nhập mật khẩu (chế độ thử nghiệm, nhập gì cũng được).");
      return;
    }
    setSubmitting(true);
    try {
      const users = await fetchAdminUsers();
      const target = users.find((u) => u.email.toLowerCase() === email);
      if (!target) {
        setError("Không tìm thấy tài khoản với email này.");
        return;
      }
      loginByUser(target);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container login-container">
      <h1>Chào mừng trở lại</h1>
      <p className="muted">
        Đăng nhập bằng email có sẵn. Hệ thống đang ở chế độ thử nghiệm, chưa kiểm tra
        mật khẩu.
      </p>
      <form className="panel" onSubmit={handleSubmit}>
        <input
          placeholder="Địa chỉ email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
        />
        <button className="btn full-width" type="submit" disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Đăng nhập"}
        </button>
        <p className="muted small mt-8">Các email demo có thể dùng:</p>
        <ul className="muted small demo-emails">
          {DEMO_EMAILS.map((e) => (
            <li key={e}>
              <code>{e}</code>
            </li>
          ))}
        </ul>
      </form>
      <div className="panel mt-8">
        <h3>Đăng nhập nhanh</h3>
        <p className="muted small">Bấm để đăng nhập nhanh, không cần nhập email.</p>
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
            Đang đăng nhập: <strong>{user.fullName}</strong> ({user.role}
            {user.shopId ? ` - Cửa hàng #${user.shopId}` : ""})
          </p>
        )}
      </div>
    </main>
  );
}
