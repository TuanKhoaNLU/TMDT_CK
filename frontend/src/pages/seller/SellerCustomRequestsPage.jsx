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
import { formatVnd } from "../../utils/format.js";

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
        if (!cancelled) setError("Không tải được yêu cầu đặt riêng.");
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
      setError("Không tạo được báo giá.");
    }
  };

  const reject = async (id) => {
    try {
      await rejectCustomRequest(id);
      refresh();
    } catch {
      setError("Không từ chối được yêu cầu.");
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
      <h1>Yêu cầu đặt riêng</h1>
      {error && <p className="panel">{error}</p>}
      {items.length === 0 && <p className="muted">Không có yêu cầu nào.</p>}
      {items.map((item) => (
        <article className="panel mb-16" key={item.id}>
          <div className="row-between">
            <div>
              <h3>
                #{item.id} - {item.title}
              </h3>
              <p className="muted">
                {item.buyerName} - Ngân sách: {formatVnd(item.budget)}
              </p>
            </div>
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
          <p>{item.description}</p>

          <div className="quotes">
            {(quotes[item.id] ?? []).map((q) => (
              <div key={q.id} className="quote-row">
                <span>
                  {formatVnd(q.price)} - {q.leadTimeDays} ngày
                </span>
                <span className="muted small">{q.note}</span>
              </div>
            ))}
          </div>

          {item.status === "PENDING" && (
            <div className="row-gap mt-8">
              <button className="btn" onClick={() => openQuote(item.id)}>
                Báo giá
              </button>
              <button className="btn ghost" onClick={() => reject(item.id)}>
                Từ chối
              </button>
            </div>
          )}
          {item.status === "ACCEPTED" && (
            <button className="btn mt-8" onClick={() => start(item.id)}>
              Bắt đầu làm
            </button>
          )}
          {item.status === "IN_PROGRESS" && (
            <button className="btn mt-8" onClick={() => finish(item.id)}>
              Hoàn thành
            </button>
          )}

          {activeQuoteId === item.id && (
            <form className="quote-form mt-8" onSubmit={submitQuote}>
              <input
                type="number"
                step="1"
                placeholder="Giá (vnd)"
                value={quoteForm.price}
                onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Thời gian hoàn thành (ngày)"
                value={quoteForm.leadTimeDays}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, leadTimeDays: e.target.value })
                }
                required
              />
              <input
                placeholder="Ghi chú"
                value={quoteForm.note}
                onChange={(e) => setQuoteForm({ ...quoteForm, note: e.target.value })}
              />
              <div className="row-gap">
                <button className="btn" type="submit">
                  Gửi báo giá
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setActiveQuoteId(null)}
                >
                  Huỷ
                </button>
              </div>
            </form>
          )}
        </article>
      ))}
    </main>
  );
}
