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
      setError("Khong dang ky duoc shop. Kiem tra lai thong tin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container page-padding shop-register">
      <h1>Mo shop cua ban</h1>
      <p className="muted">
        Dang ky tro thanh nguoi ban tren ArtisanCurator. Sau khi gui form, tai khoan
        cua ban se duoc nang cap thanh SELLER va co trang quan ly rieng.
      </p>
      <form className="panel" onSubmit={submit}>
        <label className="muted small">Ten shop *</label>
        <input
          placeholder="VD: Eleanor Crafts"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <label className="muted small">Gioi thieu</label>
        <textarea
          rows="4"
          placeholder="Mo ta phong cach, chuyen mon, vat lieu..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="muted small">Dia chi xuong/cua hang</label>
        <input
          placeholder="VD: 12 Le Loi, Da Nang"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        {error && <p className="muted">{error}</p>}
        <button className="btn full-width mt-8" type="submit" disabled={submitting}>
          {submitting ? "Dang gui..." : "Mo shop ngay"}
        </button>
      </form>
    </main>
  );
}
