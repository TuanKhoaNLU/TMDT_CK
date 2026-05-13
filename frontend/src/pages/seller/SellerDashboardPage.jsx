import { useEffect, useState } from "react";
import { fetchSellerDashboard, fetchSellerProfile } from "../../api.js";
import { useSeller } from "../../context/useSeller.js";
import { formatVnd } from "../../utils/format.js";

export default function SellerDashboardPage() {
  const { shopId } = useSeller();
  const [stats, setStats] = useState(null);
  const [shop, setShop] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchSellerDashboard(shopId), fetchSellerProfile(shopId)])
      .then(([s, sh]) => {
        setStats(s);
        setShop(sh);
      })
      .catch(() => setError("Không tải được tổng quan."));
  }, [shopId]);

  if (error) {
    return (
      <main className="container page-padding">
        <p className="panel">{error}</p>
      </main>
    );
  }
  if (!stats || !shop) {
    return (
      <main className="container page-padding">
        <p>Đang tải...</p>
      </main>
    );
  }

  const cards = [
    { label: "Tổng sản phẩm", value: stats.totalProducts },
    { label: "Tổng đơn hàng", value: stats.totalOrders },
    { label: "Doanh thu", value: formatVnd(stats.totalRevenue) },
    { label: "Yêu cầu đặt riêng", value: stats.totalCustomRequests },
  ];

  return (
    <main className="container page-padding">
      <h1>Tổng quan cửa hàng</h1>
      <p className="muted">
        {shop.name} - {shop.ownerName}
      </p>
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
