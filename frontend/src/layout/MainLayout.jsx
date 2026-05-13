import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const NAV = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/customize.html", label: "Đặt theo yêu cầu" },
  { to: "/checkout.html", label: "Thanh toán" },
  { to: "/order-history.html", label: "Đơn hàng" },
  { to: "/seller", label: "Cửa hàng của tôi" },
];

function LinkItem({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end ?? to === "/"}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      {label}
    </NavLink>
  );
}

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="site-header">
        <div className="container topbar">
          <div className="nav-left">
            <NavLink className="brand" to="/" end>
              ArtisanCurator
            </NavLink>
            <nav className="main-nav" aria-label="Main navigation">
              {NAV.map((item) => (
                <LinkItem key={item.to} to={item.to} label={item.label} end={item.end} />
              ))}
            </nav>
          </div>
          <div className="nav-right">
            <div className="nav-divider"></div>
            <nav className="utility-nav" aria-label="Account navigation">
              <LinkItem to="/wishlist.html" label="Yêu thích" />
              <LinkItem to="/profile-settings.html" label="Tài khoản" />
              {user ? (
                <>
                  <span className="muted small">
                    {user.fullName} ({user.role})
                  </span>
                  <button className="btn ghost btn-link" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <LinkItem to="/login.html" label="Đăng nhập" />
              )}
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
      <footer>
        <div className="container muted">© 2026 ArtisanCurator</div>
      </footer>
    </>
  );
}
