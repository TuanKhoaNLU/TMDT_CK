import { useEffect, useState } from "react";
import {
  acceptQuote,
  createCustomRequest,
  fetchCustomRequestQuotes,
  fetchCustomRequests,
} from "../api.js";
import { useAuth } from "../context/useAuth.js";
import { formatVnd } from "../utils/format.js";

const emptyForm = {
  shopId: 1,
  title: "",
  description: "",
  budget: 0,
};

export default function CustomizePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchCustomRequests({ buyerId: user.id });
        if (cancelled) return;
        setItems(list);
        const quoteEntries = await Promise.all(
          list.map(async (r) => [r.id, await fetchCustomRequestQuotes(r.id)])
        );
        if (cancelled) return;
        setQuotes(Object.fromEntries(quoteEntries));
      } catch {
        if (!cancelled) setError("Không tải được danh sách yêu cầu đặt riêng.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, user]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const submit = async (event) => {
    event.preventDefault();
    if (!user) return;
    try {
      await createCustomRequest({
        ...form,
        buyerId: user.id,
        buyerName: user.fullName,
        budget: Number(form.budget),
      });
      setForm(emptyForm);
      refresh();
    } catch {
      setError("Không gửi được yêu cầu.");
    }
  };

  const accept = async (requestId, quoteId) => {
    try {
      await acceptQuote(requestId, quoteId);
      refresh();
    } catch {
      setError("Không duyệt được báo giá.");
    }
  };

  return (
    <main className="container page-padding">
      <div className="two-col">
        <section className="panel">
          <h2>Đặt làm theo yêu cầu</h2>
          <p className="muted">Gửi yêu cầu đặt riêng cho cửa hàng thủ công.</p>
          <form onSubmit={submit}>
            <input
              placeholder="Tiêu đề"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              rows="4"
              placeholder="Mô tả chi tiết (màu sắc, kích thước, ngày cần)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Ngân sách (vnd)"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Mã cửa hàng"
              value={form.shopId}
              onChange={(e) => setForm({ ...form, shopId: Number(e.target.value) })}
              required
            />
            <button className="btn full-width" type="submit">
              Gửi yêu cầu
            </button>
          </form>
        </section>
        <aside className="panel">
          <h3>Yêu cầu của tôi</h3>
          {error && <p className="muted">{error}</p>}
          {items.length === 0 && <p className="muted">Chưa có yêu cầu nào.</p>}
          {items.map((item) => (
            <article key={item.id} className="custom-card">
              <div className="row-between">
                <strong>{item.title}</strong>
                <span
                  className={`badge ${
                    item.status === "ACCEPTED" || item.status === "COMPLETED"
                      ? "ok"
                      : "off"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="muted">Ngân sách: {formatVnd(item.budget)}</p>
              <p>{item.description}</p>
              <div className="quotes">
                {(quotes[item.id] ?? []).map((q) => (
                  <div key={q.id} className="quote-row">
                    <span>
                      {formatVnd(q.price)} - {q.leadTimeDays} ngày
                    </span>
                    <span className="muted small">{q.note}</span>
                    {item.status === "QUOTED" && (
                      <button className="btn" onClick={() => accept(item.id, q.id)}>
                        Duyệt
                      </button>
                    )}
                  </div>
                ))}
                {(!quotes[item.id] || quotes[item.id].length === 0) && (
                  <p className="muted small">Đang chờ cửa hàng báo giá...</p>
                )}
              </div>
            </article>
          ))}
        </aside>
      </div>
    </main>
  );
}
