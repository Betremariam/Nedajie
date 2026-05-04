import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("adminToken");
  const adminStr = localStorage.getItem("admin");

  // No token or admin data - redirect to login
  if (!token || !adminStr) {
    return <Navigate to="/" replace />;
  }

  try {
    // Validate token expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      // Token expired, clear storage and redirect to login
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      localStorage.removeItem("stationIds");
      return <Navigate to="/" replace />;
    }

    // Check if user must change password
    const admin = JSON.parse(adminStr);
    if (admin.mustChangePassword && window.location.pathname !== "/change-password") {
      return <Navigate to="/change-password" replace />;
    }

    // Check role authorization if roles are specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
      // Unauthorized role - redirect to their appropriate dashboard
      if (admin.role === "super") return <Navigate to="/super-admin/dashboard" replace />;
      if (admin.role === "federal") return <Navigate to="/federal/dashboard" replace />;
      if (admin.role === "approver") return <Navigate to="/approver/dashboard" replace />;
      if (admin.role === "register") return <Navigate to="/register/register-dashboard" replace />;
      if (admin.role === "stationOwner") return <Navigate to="/owner/dashboard" replace />;
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (e) {
    // Invalid token format, clear storage and redirect to login
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("stationIds");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
