import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import MainLayout from "./MainLayout.jsx";

export default function PublicShell() {
  const { user } = useAuth();
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  return <MainLayout />;
}
