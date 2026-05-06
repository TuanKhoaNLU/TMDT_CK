import { useEffect, useState } from "react";
import { fetchOrders } from "../api.js";
import OrderPanels from "../components/OrderPanels.jsx";

export default function CheckoutPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => {
      setError("Khong the tai thong tin don hang.");
    });
  }, []);

  return (
    <main className="container page-padding">
      <div className="two-col">
        <div className="panel">
          <h2>Contact Information</h2>
          <input placeholder="Email" />
          <input placeholder="Phone" />
          <h2>Shipping Address</h2>
          <input placeholder="Full Name" />
          <input placeholder="Street Address" />
          <input placeholder="City" />
          <input placeholder="Zip Code" />
          <button className="btn">Continue To Payment</button>
        </div>
        <aside className="panel">
          <h3>Order Summary</h3>
          {error ? <p>{error}</p> : <OrderPanels orders={orders} />}
        </aside>
      </div>
    </main>
  );
}
