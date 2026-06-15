// src/components/auth/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore.js";

const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  // 👀 If already signed in → redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
