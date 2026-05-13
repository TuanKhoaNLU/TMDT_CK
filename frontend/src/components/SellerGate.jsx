import { Navigate } from "react-router-dom";
import SellerLayout from "../layout/SellerLayout.jsx";
import ShopRegistrationPage from "../pages/seller/ShopRegistrationPage.jsx";
import { useAuth } from "../context/useAuth.js";

export default function SellerGate() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login.html" replace />;
  }
  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === "BUYER" || !user.shopId) {
    return <ShopRegistrationPage />;
  }
  return <SellerLayout />;
}
