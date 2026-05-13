import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../api.js";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminDashboard()
      .then(setStats)
      .catch(() => setError("Khong tai duoc thong ke."));
  }, []);

  if (error) return <main className="container page-padding"><p className="panel">{error}</p></main>;
  if (!stats) return <main className="container page-padding"><p>Dang tai...</p></main>;

  const cards = [
    { label: "Nguoi dung", value: stats.totalUsers },
    { label: "Cua hang", value: stats.totalShops },
    { label: "San pham", value: stats.totalProducts },
    { label: "Don hang", value: stats.totalOrders },
    { label: "Custom Request", value: stats.totalCustomRequests },
  ];

  return (
    <main className="container page-padding">
      <h1>Admin Dashboard</h1>
      <section className="grid stat-grid">
        {cards.map((card) => (
          <article className="card stat-card" key={card.label}>
            <div className="card-body">
              <p className="muted">{card.label}</p>
              <h2>{card.value}</h2>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
