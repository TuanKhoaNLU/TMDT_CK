import { useEffect, useState } from "react";
import { fetchOrders } from "../api.js";
import OrderPanels from "../components/OrderPanels.jsx";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => {
      setError("Khong the tai lich su don hang.");
    });
  }, []);

  return (
    <main className="container page-padding">
      <h1>My Collection & Past Treasures</h1>
      {error ? <p className="panel">{error}</p> : <OrderPanels orders={orders} />}
    </main>
  );
}
