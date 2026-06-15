// src/components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore.js";

const ProtectedRoute = ({ children, role }) => {
  const user = useAuthStore((state) => state.user);

  // 🚫 Not logged in
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // 👮 Role check (if role is required)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
