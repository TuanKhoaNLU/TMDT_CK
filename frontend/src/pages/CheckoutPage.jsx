import { useEffect, useState } from "react";
import { fetchOrders } from "../api.js";
import OrderPanels from "../components/OrderPanels.jsx";

export default function CheckoutPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {
        setError("Không thể tải thông tin đơn hàng.");
      });
  }, []);

  return (
    <main className="container page-padding">
      <div className="two-col">
        <div className="panel">
          <h2>Thông tin liên hệ</h2>
          <input placeholder="Email" />
          <input placeholder="Số điện thoại" />
          <h2>Địa chỉ giao hàng</h2>
          <input placeholder="Họ và tên" />
          <input placeholder="Địa chỉ" />
          <input placeholder="Tỉnh / Thành phố" />
          <input placeholder="Mã bưu chính" />
          <button className="btn">Tiếp tục thanh toán</button>
        </div>
        <aside className="panel">
          <h3>Tóm tắt đơn hàng</h3>
          {error ? <p>{error}</p> : <OrderPanels orders={orders} />}
        </aside>
      </div>
    </main>
  );
}
