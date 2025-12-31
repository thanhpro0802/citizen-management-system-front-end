// src/components/ProtectedRoute/index.js
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "context/authContext";

function ProtectedRoute({ children, allowedRoles, requiredRole }) {
  const [authState] = useAuth();
  const { isAuthenticated, user } = authState;

  // 1. Kiểm tra đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // 2. Lấy role hiện tại của user từ Context
  const userRole =
    user?.vaiTro || user?.role || (Array.isArray(user?.roles) ? user.roles[0] : "") || "";

  // 3. Logic kiểm tra quyền mới (Ưu tiên mảng allowedRoles)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      console.log(`ProtectedRoute: Chặn truy cập. Role ${userRole} không nằm trong`, allowedRoles);
      return <Navigate to="/forbidden" replace />;
    }
  }
  // Hỗ trợ ngược cho requiredRole cũ
  else if (requiredRole) {
    if (userRole !== requiredRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string), // Thêm propType mới
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;
