import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerShop } from "../../api.js";
import { useAuth } from "../../context/useAuth.js";

export default function ShopRegistrationPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await registerShop({
        buyerId: user.id,
        name: form.name,
        description: form.description,
        address: form.address,
      });
      login(result.user);
      navigate("/seller");
    } catch {
      setError("Không đăng ký được cửa hàng. Kiểm tra lại thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container page-padding shop-register">
      <h1>Mở cửa hàng của bạn</h1>
      <p className="muted">
        Đăng ký trở thành người bán trên ArtisanCurator. Sau khi gửi biểu mẫu, tài
        khoản của bạn sẽ được nâng cấp thành người bán và có trang quản lý riêng.
      </p>
      <form className="panel" onSubmit={submit}>
        <label className="muted small">Tên cửa hàng *</label>
        <input
          placeholder="Ví dụ: Xưởng gốm An Nhiên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <label className="muted small">Giới thiệu</label>
        <textarea
          rows="4"
          placeholder="Mô tả phong cách, chuyên môn, vật liệu..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="muted small">Địa chỉ xưởng / cửa hàng</label>
        <input
          placeholder="Ví dụ: 12 Lê Lợi, Đà Nẵng"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        {error && <p className="muted">{error}</p>}
        <button
          className="btn full-width mt-8"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Đang gửi..." : "Mở cửa hàng ngay"}
        </button>
      </form>
    </main>
  );
}
