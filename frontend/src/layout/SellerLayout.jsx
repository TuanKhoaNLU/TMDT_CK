import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const SELLER_NAV = [
  { to: "/seller", label: "Dashboard", end: true },
  { to: "/seller/products", label: "Products" },
  { to: "/seller/orders", label: "Orders" },
  { to: "/seller/custom-requests", label: "Custom Requests" },
];

export default function SellerLayout() {
  const { user } = useAuth();

  return (
    <>
      <div className="container seller-shell">
        <div className="seller-header">
          <div>
            <h1 className="seller-title">My Shop</h1>
            {user && (
              <p className="muted small">
                {user.fullName} - Shop #{user.shopId}
              </p>
            )}
          </div>
          <nav className="seller-nav">
            {SELLER_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <Outlet />
    </>
  );
}
