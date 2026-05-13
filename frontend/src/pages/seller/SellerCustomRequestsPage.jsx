import { useEffect, useState } from "react";
import {
  fetchCustomRequestQuotes,
  fetchSellerCustomRequests,
  markRequestComplete,
  markRequestInProgress,
  rejectCustomRequest,
  sellerCreateQuote,
} from "../../api.js";
import { useSeller } from "../../context/useSeller.js";

const emptyQuote = { price: 0, leadTimeDays: 7, note: "" };

export default function SellerCustomRequestsPage() {
  const { shopId } = useSeller();
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [activeQuoteId, setActiveQuoteId] = useState(null);
  const [quoteForm, setQuoteForm] = useState(emptyQuote);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchSellerCustomRequests(shopId);
        if (cancelled) return;
        setItems(list);
        const entries = await Promise.all(
          list.map(async (r) => [r.id, await fetchCustomRequestQuotes(r.id)])
        );
        if (cancelled) return;
        setQuotes(Object.fromEntries(entries));
      } catch {
        if (!cancelled) setError("Khong tai duoc custom request.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [shopId, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const openQuote = (id) => {
    setActiveQuoteId(id);
    setQuoteForm(emptyQuote);
  };

  const submitQuote = async (event) => {
    event.preventDefault();
    try {
      await sellerCreateQuote(shopId, activeQuoteId, {
        price: Number(quoteForm.price),
        leadTimeDays: Number(quoteForm.leadTimeDays),
        note: quoteForm.note,
      });
      setActiveQuoteId(null);
      refresh();
    } catch {
      setError("Khong tao duoc bao gia.");
    }
  };

  const reject = async (id) => {
    try {
      await rejectCustomRequest(id);
      refresh();
    } catch {
      setError("Khong tu choi duoc yeu cau.");
    }
  };

  const start = async (id) => {
    await markRequestInProgress(id);
    refresh();
  };

  const finish = async (id) => {
    await markRequestComplete(id);
    refresh();
  };

  return (
    <main className="container page-padding">
      <h1>Custom Request</h1>
      {error && <p className="panel">{error}</p>}
      {items.length === 0 && <p className="muted">Khong co yeu cau nao.</p>}
      {items.map((item) => (
        <article className="panel mb-16" key={item.id}>
          <div className="row-between">
            <div>
              <h3>
                #{item.id} - {item.title}
              </h3>
              <p className="muted">
                {item.buyerName} - Ngan sach: ${Number(item.budget).toFixed(2)}
              </p>
            </div>
            <span className={`badge ${item.status === "ACCEPTED" || item.status === "COMPLETED" ? "ok" : "off"}`}>
              {item.status}
            </span>
          </div>
          <p>{item.description}</p>

          <div className="quotes">
            {(quotes[item.id] ?? []).map((q) => (
              <div key={q.id} className="quote-row">
                <span>${Number(q.price).toFixed(2)} - {q.leadTimeDays} ngay</span>
                <span className="muted small">{q.note}</span>
              </div>
            ))}
          </div>

          {item.status === "PENDING" && (
            <div className="row-gap mt-8">
              <button className="btn" onClick={() => openQuote(item.id)}>Bao gia</button>
              <button className="btn ghost" onClick={() => reject(item.id)}>Tu choi</button>
            </div>
          )}
          {item.status === "ACCEPTED" && (
            <button className="btn mt-8" onClick={() => start(item.id)}>Bat dau lam</button>
          )}
          {item.status === "IN_PROGRESS" && (
            <button className="btn mt-8" onClick={() => finish(item.id)}>Hoan thanh</button>
          )}

          {activeQuoteId === item.id && (
            <form className="quote-form mt-8" onSubmit={submitQuote}>
              <input
                type="number"
                step="0.01"
                placeholder="Gia"
                value={quoteForm.price}
                onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Lead time (ngay)"
                value={quoteForm.leadTimeDays}
                onChange={(e) => setQuoteForm({ ...quoteForm, leadTimeDays: e.target.value })}
                required
              />
              <input
                placeholder="Ghi chu"
                value={quoteForm.note}
                onChange={(e) => setQuoteForm({ ...quoteForm, note: e.target.value })}
              />
              <div className="row-gap">
                <button className="btn" type="submit">Gui bao gia</button>
                <button type="button" className="btn ghost" onClick={() => setActiveQuoteId(null)}>
                  Huy
                </button>
              </div>
            </form>
          )}
        </article>
      ))}
    </main>
  );
}
