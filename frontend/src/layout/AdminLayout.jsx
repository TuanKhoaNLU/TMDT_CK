import { NavLink, Outlet } from "react-router-dom";

const ADMIN_NAV = [
  { to: "/admin", label: "Tổng quan", end: true },
  { to: "/admin/users", label: "Người dùng" },
  { to: "/admin/products", label: "Sản phẩm" },
];

export default function AdminLayout() {
  return (
    <>
      <div className="container seller-shell">
        <div className="seller-header">
          <h1 className="seller-title">Trang quản trị</h1>
          <nav className="seller-nav">
            {ADMIN_NAV.map((item) => (
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
