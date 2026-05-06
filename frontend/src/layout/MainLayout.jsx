import { NavLink, Outlet } from "react-router-dom";

const mainNav = [
  { to: "/", label: "Gallery" },
  { to: "/customize.html", label: "Custom Studio" },
  { to: "/checkout.html", label: "Checkout" },
  { to: "/order-history.html", label: "Orders" },
];

const utilityNav = [
  { to: "/wishlist.html", label: "Wishlist" },
  { to: "/profile-settings.html", label: "Profile" },
  { to: "/login.html", label: "Login" },
];

function LinkItem({ to, label }) {
  return (
    <NavLink to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
      {label}
    </NavLink>
  );
}

export default function MainLayout() {
  return (
    <>
      <header className="site-header">
        <div className="container topbar">
          <div className="nav-left">
            <NavLink className="brand" to="/" end>
              ArtisanCurator
            </NavLink>
            <nav className="main-nav" aria-label="Main navigation">
              {mainNav.map((item) => (
                <LinkItem key={item.to} to={item.to} label={item.label} />
              ))}
            </nav>
          </div>
          <div className="nav-right">
            <div className="nav-divider"></div>
            <nav className="utility-nav" aria-label="Account navigation">
              {utilityNav.map((item) => (
                <LinkItem key={item.to} to={item.to} label={item.label} />
              ))}
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
