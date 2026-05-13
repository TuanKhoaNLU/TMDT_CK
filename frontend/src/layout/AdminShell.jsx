import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function AdminShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login.html");
  };

  return (
    <>
      <header className="site-header admin-header">
        <div className="container topbar">
          <div className="nav-left">
            <NavLink className="brand" to="/admin" end>
              ArtisanCurator Admin
            </NavLink>
          </div>
          <div className="nav-right">
            {user && (
              <span className="muted small">
                {user.fullName} ({user.role})
              </span>
            )}
            <button className="btn ghost btn-link" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <Outlet />
      <footer>
        <div className="container muted">© 2026 The Artisanal Curator - Admin</div>
      </footer>
    </>
  );
}
