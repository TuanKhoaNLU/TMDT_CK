import { useEffect, useState } from "react";
import { fetchOrders } from "../api.js";
import OrderPanels from "../components/OrderPanels.jsx";

export default function OrderConfirmationPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {
        setError("Không thể tải thông tin xác nhận đơn hàng.");
      });
  }, []);

  return (
    <main className="container page-padding">
      <div className="two-col">
        <section className="panel">
          <h2>Mã đơn #ATC-8829-2024</h2>
          <p className="muted">Dự kiến giao: 14/11 - 18/11</p>
          {error ? <p>{error}</p> : <OrderPanels orders={orders} />}
        </section>
        <aside className="panel">
          <h3>Giao đến</h3>
          <p>
            Nguyễn Thị Hoa
            <br />
            128 Lê Lợi, Quận 1
            <br />
            TP. Hồ Chí Minh
          </p>
        </aside>
      </div>
    </main>
  );
}
