import { useEffect, useState } from "react";
import {
  acceptQuote,
  createCustomRequest,
  fetchCustomRequestQuotes,
  fetchCustomRequests,
} from "../api.js";

const DEFAULT_BUYER = { id: 3, name: "Eleanor Varce" };

const emptyForm = {
  shopId: 1,
  title: "",
  description: "",
  budget: 0,
};

export default function CustomizePage() {
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchCustomRequests({ buyerId: DEFAULT_BUYER.id });
        if (cancelled) return;
        setItems(list);
        const quoteEntries = await Promise.all(
          list.map(async (r) => [r.id, await fetchCustomRequestQuotes(r.id)])
        );
        if (cancelled) return;
        setQuotes(Object.fromEntries(quoteEntries));
      } catch {
        if (!cancelled) setError("Khong tai duoc danh sach custom request.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await createCustomRequest({
        ...form,
        buyerId: DEFAULT_BUYER.id,
        buyerName: DEFAULT_BUYER.name,
        budget: Number(form.budget),
      });
      setForm(emptyForm);
      refresh();
    } catch {
      setError("Khong gui duoc yeu cau.");
    }
  };

  const accept = async (requestId, quoteId) => {
    try {
      await acceptQuote(requestId, quoteId);
      refresh();
    } catch {
      setError("Khong duyet duoc bao gia.");
    }
  };

  return (
    <main className="container page-padding">
      <div className="two-col">
        <section className="panel">
          <h2>Custom Studio</h2>
          <p className="muted">Gui yeu cau dat lam thu cong rieng cho shop.</p>
          <form onSubmit={submit}>
            <input
              placeholder="Tieu de"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              rows="4"
              placeholder="Mo ta chi tiet (mau sac, kich thuoc, ngay can)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Ngan sach ($)"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Shop ID"
              value={form.shopId}
              onChange={(e) => setForm({ ...form, shopId: Number(e.target.value) })}
              required
            />
            <button className="btn full-width" type="submit">Gui yeu cau</button>
          </form>
        </section>
        <aside className="panel">
          <h3>Yeu cau cua toi</h3>
          {error && <p className="muted">{error}</p>}
          {items.length === 0 && <p className="muted">Chua co yeu cau nao.</p>}
          {items.map((item) => (
            <article key={item.id} className="custom-card">
              <div className="row-between">
                <strong>{item.title}</strong>
                <span className={`badge ${item.status === "ACCEPTED" || item.status === "COMPLETED" ? "ok" : "off"}`}>
                  {item.status}
                </span>
              </div>
              <p className="muted">Ngan sach: ${Number(item.budget).toFixed(2)}</p>
              <p>{item.description}</p>
              <div className="quotes">
                {(quotes[item.id] ?? []).map((q) => (
                  <div key={q.id} className="quote-row">
                    <span>
                      ${Number(q.price).toFixed(2)} - {q.leadTimeDays} ngay
                    </span>
                    <span className="muted small">{q.note}</span>
                    {item.status === "QUOTED" && (
                      <button className="btn" onClick={() => accept(item.id, q.id)}>
                        Duyet
                      </button>
                    )}
                  </div>
                ))}
                {(!quotes[item.id] || quotes[item.id].length === 0) && (
                  <p className="muted small">Cho shop bao gia...</p>
                )}
              </div>
            </article>
          ))}
        </aside>
      </div>
    </main>
  );
}
