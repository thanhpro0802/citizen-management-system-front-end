/**
 * ProtectedRoute Component
 * Bảo vệ routes dựa trên authentication và role
 */

import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "context/authContext";
import { coRole } from "services/authService";

/**
 * Component bảo vệ route
 * @param {object} props - Props
 * @param {node} props.children - Component con cần bảo vệ
 * @param {string} props.requiredRole - Role yêu cầu để truy cập (optional)
 * @returns {node} Component con hoặc Navigate
 */
function ProtectedRoute({ children, requiredRole }) {
  const [authState] = useAuth();
  const { isAuthenticated, user } = authState;

  // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // Nếu yêu cầu role cụ thể
  if (requiredRole) {
    // Kiểm tra user có role yêu cầu không (truyền user để tránh duplicate check)
    if (!coRole(requiredRole, user)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // Nếu đủ điều kiện, render component
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  requiredRole: null,
};

export default ProtectedRoute;
