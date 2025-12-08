/**
 * Authentication Context - Quản lý trạng thái đăng nhập toàn ứng dụng
 */

import { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { layThongTinNguoiDung, layToken, kiemTraDaDangNhap } from "services/authService";

// Tạo context
const AuthContext = createContext();

// Đặt tên hiển thị cho context
AuthContext.displayName = "AuthContext";

// Reducer để quản lý state
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }
    case "UPDATE_USER": {
      return {
        ...state,
        user: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Provider component
function AuthProvider({ children }) {
  const initialState = {
    isAuthenticated: kiemTraDaDangNhap(),
    user: layThongTinNguoiDung(),
    token: layToken(),
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook để sử dụng auth context
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setLogin = (dispatch, user, token) =>
  dispatch({
    type: "LOGIN",
    payload: { user, token },
  });

const setLogout = (dispatch) =>
  dispatch({
    type: "LOGOUT",
  });

const updateUser = (dispatch, user) =>
  dispatch({
    type: "UPDATE_USER",
    payload: user,
  });

export { AuthProvider, useAuth, setLogin, setLogout, updateUser };
