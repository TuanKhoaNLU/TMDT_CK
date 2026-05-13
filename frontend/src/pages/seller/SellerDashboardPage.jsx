import { useEffect, useState } from "react";
import { fetchSellerDashboard, fetchSellerProfile } from "../../api.js";
import { useSeller } from "../../context/useSeller.js";

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
      .catch(() => setError("Khong tai duoc dashboard."));
  }, [shopId]);

  if (error) return <main className="container page-padding"><p className="panel">{error}</p></main>;
  if (!stats || !shop) return <main className="container page-padding"><p>Dang tai...</p></main>;

  const cards = [
    { label: "Tong san pham", value: stats.totalProducts },
    { label: "Tong don hang", value: stats.totalOrders },
    { label: "Doanh thu", value: `$${Number(stats.totalRevenue).toFixed(2)}` },
    { label: "Custom Request", value: stats.totalCustomRequests },
  ];

  return (
    <main className="container page-padding">
      <h1>Seller Dashboard</h1>
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
