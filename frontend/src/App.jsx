import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import CustomizePage from "./pages/CustomizePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import ProfileSettingsPage from "./pages/ProfileSettingsPage.jsx";
import ProgressCheckPage from "./pages/ProgressCheckPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/customize.html" element={<CustomizePage />} />
        <Route path="/checkout.html" element={<CheckoutPage />} />
        <Route path="/order-history.html" element={<OrderHistoryPage />} />
        <Route
          path="/order-confirmation.html"
          element={<OrderConfirmationPage />}
        />
        <Route path="/profile-settings.html" element={<ProfileSettingsPage />} />
        <Route path="/progress-check.html" element={<ProgressCheckPage />} />
        <Route path="/wishlist.html" element={<WishlistPage />} />
        <Route path="/login.html" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
