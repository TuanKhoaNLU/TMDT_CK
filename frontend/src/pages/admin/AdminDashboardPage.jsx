import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../api.js";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminDashboard()
      .then(setStats)
      .catch(() => setError("Không tải được thống kê."));
  }, []);

  if (error) {
    return (
      <main className="container page-padding">
        <p className="panel">{error}</p>
      </main>
    );
  }
  if (!stats) {
    return (
      <main className="container page-padding">
        <p>Đang tải...</p>
      </main>
    );
  }

  const cards = [
    { label: "Người dùng", value: stats.totalUsers },
    { label: "Cửa hàng", value: stats.totalShops },
    { label: "Sản phẩm", value: stats.totalProducts },
    { label: "Đơn hàng", value: stats.totalOrders },
    { label: "Yêu cầu đặt riêng", value: stats.totalCustomRequests },
  ];

  return (
    <main className="container page-padding">
      <h1>Tổng quan hệ thống</h1>
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
