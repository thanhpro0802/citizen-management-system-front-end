/**
 * RoleBasedRender Component
 * Hiển thị hoặc ẩn UI elements dựa trên role của người dùng
 */

import PropTypes from "prop-types";
import { useAuth } from "context/authContext";
import { coRole } from "services/authService";

/**
 * Component render có điều kiện dựa trên role
 * @param {object} props - Props
 * @param {node} props.children - Component con cần render
 * @param {string} props.requiredRole - Role yêu cầu để hiển thị (optional)
 * @param {boolean} props.requireAuth - Yêu cầu đăng nhập để hiển thị (optional)
 * @param {node} props.fallback - Component thay thế nếu không đủ quyền (optional)
 * @returns {node|null} Component con hoặc fallback hoặc null
 */
function RoleBasedRender({ children, requiredRole, requireAuth, fallback }) {
  const [authState] = useAuth();
  const { isAuthenticated, user } = authState;

  // Nếu yêu cầu đăng nhập mà chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  // Nếu yêu cầu role cụ thể
  if (requiredRole) {
    // Kiểm tra user có role yêu cầu không (truyền user để tránh duplicate check)
    if (!coRole(requiredRole, user)) {
      return fallback || null;
    }
  }

  // Nếu đủ điều kiện, render children
  return children;
}

RoleBasedRender.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
  requireAuth: PropTypes.bool,
  fallback: PropTypes.node,
};

RoleBasedRender.defaultProps = {
  requiredRole: null,
  requireAuth: false,
  fallback: null,
};

export default RoleBasedRender;
