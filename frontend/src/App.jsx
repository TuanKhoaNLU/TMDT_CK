import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SellerGate from "./components/SellerGate.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminShell from "./layout/AdminShell.jsx";
import PublicShell from "./layout/PublicShell.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import CustomizePage from "./pages/CustomizePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import ProfileSettingsPage from "./pages/ProfileSettingsPage.jsx";
import ProgressCheckPage from "./pages/ProgressCheckPage.jsx";
import SellerCustomRequestsPage from "./pages/seller/SellerCustomRequestsPage.jsx";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage.jsx";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage.jsx";
import SellerProductsPage from "./pages/seller/SellerProductsPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route element={<AdminShell />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PublicShell />}>
        <Route index element={<HomePage />} />
        <Route path="/login.html" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/customize.html" element={<CustomizePage />} />
          <Route path="/checkout.html" element={<CheckoutPage />} />
          <Route path="/order-history.html" element={<OrderHistoryPage />} />
          <Route
            path="/order-confirmation.html"
            element={<OrderConfirmationPage />}
          />
          <Route
            path="/profile-settings.html"
            element={<ProfileSettingsPage />}
          />
          <Route path="/progress-check.html" element={<ProgressCheckPage />} />
          <Route path="/wishlist.html" element={<WishlistPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={["BUYER", "SELLER"]} />}>
          <Route path="/seller" element={<SellerGate />}>
            <Route index element={<SellerDashboardPage />} />
            <Route path="products" element={<SellerProductsPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
            <Route path="custom-requests" element={<SellerCustomRequestsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
