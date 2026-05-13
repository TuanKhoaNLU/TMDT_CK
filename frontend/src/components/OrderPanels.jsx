import { formatVnd } from "../utils/format.js";

export default function OrderPanels({ orders }) {
  return (
    <>
      {orders.map((order) => (
        <article className="panel mb-16" key={order.id}>
          <h3>Đơn hàng #{order.id}</h3>
          <p className="muted">Trạng thái: {order.status}</p>
          <p>
            {order.receiverName} - {order.shippingAddress}
          </p>
          <strong>Tổng: {formatVnd(order.total)}</strong>
        </article>
      ))}
    </>
  );
}
