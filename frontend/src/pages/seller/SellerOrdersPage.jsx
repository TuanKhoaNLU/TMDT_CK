import { useEffect, useState } from "react";
import { fetchSellerOrders, updateOrderStatus } from "../../api.js";
import { useSeller } from "../../context/useSeller.js";
import { formatVnd } from "../../utils/format.js";

const STATUSES = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã huỷ" },
];

export default function SellerOrdersPage() {
  const { shopId } = useSeller();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    fetchSellerOrders(shopId)
      .then(setOrders)
      .catch(() => setError("Không tải được đơn hàng."));
  };

  useEffect(load, [shopId]);

  const changeStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(shopId, orderId, status);
      load();
    } catch {
      setError("Không cập nhật được trạng thái.");
    }
  };

  return (
    <main className="container page-padding">
      <h1>Đơn hàng của cửa hàng</h1>
      {error && <p className="panel">{error}</p>}
      {orders.length === 0 && <p className="muted">Chưa có đơn hàng nào.</p>}
      {orders.map((order) => (
        <article className="panel mb-16" key={order.id}>
          <div className="row-between">
            <div>
              <h3>Đơn hàng #{order.id}</h3>
              <p className="muted">
                {order.receiverName} - {order.shippingAddress}
              </p>
            </div>
            <div className="text-right">
              <strong>{formatVnd(order.total)}</strong>
              <p className="muted">
                <span
                  className={`badge ${order.status === "DELIVERED" ? "ok" : "off"}`}
                >
                  {STATUSES.find((s) => s.value === order.status)?.label ??
                    order.status}
                </span>
              </p>
            </div>
          </div>
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.productName} × {item.quantity} - {formatVnd(item.unitPrice)}
              </li>
            ))}
          </ul>
          <div className="row-gap mt-8">
            <label className="muted">Cập nhật trạng thái:</label>
            <select
              value={order.status}
              onChange={(e) => changeStatus(order.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </article>
      ))}
    </main>
  );
}
