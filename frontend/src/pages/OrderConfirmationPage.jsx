import { useEffect, useState } from "react";
import { fetchOrders } from "../api.js";
import OrderPanels from "../components/OrderPanels.jsx";

export default function OrderConfirmationPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => {
      setError("Khong the tai thong tin xac nhan don hang.");
    });
  }, []);

  return (
    <main className="container page-padding">
      <div className="two-col">
        <section className="panel">
          <h2>Order Reference #ATC-8829-2024</h2>
          <p className="muted">Expected arrival: Nov 14 - Nov 18</p>
          {error ? <p>{error}</p> : <OrderPanels orders={orders} />}
        </section>
        <aside className="panel">
          <h3>Shipping To</h3>
          <p>
            Eleanor Varce
            <br />
            1284 Artisans Row
            <br />
            Hudson Valley, NY 12534
          </p>
        </aside>
      </div>
    </main>
  );
}
