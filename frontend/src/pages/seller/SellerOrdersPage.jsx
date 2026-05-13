import { useEffect, useState } from "react";
import { fetchSellerOrders, updateOrderStatus } from "../../api.js";
import { useSeller } from "../../context/useSeller.js";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];

export default function SellerOrdersPage() {
  const { shopId } = useSeller();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    fetchSellerOrders(shopId)
      .then(setOrders)
      .catch(() => setError("Khong tai duoc don hang."));
  };

  useEffect(load, [shopId]);

  const changeStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(shopId, orderId, status);
      load();
    } catch {
      setError("Khong cap nhat duoc trang thai.");
    }
  };

  return (
    <main className="container page-padding">
      <h1>Don hang cua shop</h1>
      {error && <p className="panel">{error}</p>}
      {orders.length === 0 && <p className="muted">Chua co don hang.</p>}
      {orders.map((order) => (
        <article className="panel mb-16" key={order.id}>
          <div className="row-between">
            <div>
              <h3>Order #{order.id}</h3>
              <p className="muted">
                {order.receiverName} - {order.shippingAddress}
              </p>
            </div>
            <div className="text-right">
              <strong>${Number(order.total).toFixed(2)}</strong>
              <p className="muted">
                <span className={`badge ${order.status === "DELIVERED" ? "ok" : "off"}`}>
                  {order.status}
                </span>
              </p>
            </div>
          </div>
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.productName} × {item.quantity} - $
                {Number(item.unitPrice).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="row-gap mt-8">
            <label className="muted">Cap nhat trang thai:</label>
            <select
              value={order.status}
              onChange={(e) => changeStatus(order.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </article>
      ))}
    </main>
  );
}
