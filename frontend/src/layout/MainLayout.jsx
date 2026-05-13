import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const NAV = [
  { to: "/", label: "Gallery", end: true },
  { to: "/customize.html", label: "Custom Studio" },
  { to: "/checkout.html", label: "Checkout" },
  { to: "/order-history.html", label: "Orders" },
  { to: "/seller", label: "My Shop" },
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
              <LinkItem to="/wishlist.html" label="Wishlist" />
              <LinkItem to="/profile-settings.html" label="Profile" />
              {user ? (
                <>
                  <span className="muted small">
                    {user.fullName} ({user.role})
                  </span>
                  <button className="btn ghost btn-link" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <LinkItem to="/login.html" label="Login" />
              )}
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
      <footer>
        <div className="container muted">© 2026 The Artisanal Curator</div>
      </footer>
    </>
  );
}
