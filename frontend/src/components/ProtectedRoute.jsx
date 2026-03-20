import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "admin" ? "/admin" : user.role === "host" ? "/host" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
