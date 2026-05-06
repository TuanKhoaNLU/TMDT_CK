export default function OrderPanels({ orders }) {
  return (
    <>
      {orders.map((order) => (
        <article className="panel mb-16" key={order.id}>
          <h3>Order #{order.id}</h3>
          <p className="muted">Status: {order.status}</p>
          <p>
            {order.receiverName} - {order.shippingAddress}
          </p>
          <strong>Total: ${Number(order.total).toFixed(2)}</strong>
        </article>
      ))}
    </>
  );
}
