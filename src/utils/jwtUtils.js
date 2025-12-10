/**
 * JWT Utility Functions
 * Giải mã JWT token để lấy thông tin payload
 */

/**
 * Giải mã JWT token (không verify signature - chỉ decode)
 * @param {string} token - JWT token
 * @returns {object|null} Payload của token hoặc null nếu lỗi
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // JWT có format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode phần payload (base64url)
    let payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Thêm padding nếu cần (base64 cần độ dài chia hết cho 4)
    const padLength = (4 - (base64.length % 4)) % 4;
    const paddedBase64 = base64 + "=".repeat(padLength);

    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Lỗi giải mã JWT:", error);
    return null;
  }
};

/**
 * Lấy roles từ JWT token
 * @param {string} token - JWT token
 * @returns {array} Mảng các roles hoặc mảng rỗng
 */
export const getRolesFromToken = (token) => {
  const payload = decodeJWT(token);
  if (!payload) return [];

  // Backend Spring Security thường lưu roles trong trường 'roles' hoặc 'authorities'
  return payload.roles || payload.authorities || [];
};

/**
 * Kiểm tra token có hết hạn chưa
 * @param {string} token - JWT token
 * @returns {boolean} True nếu token hết hạn
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;

  // exp trong JWT là Unix timestamp (giây)
  const expirationTime = payload.exp * 1000; // Chuyển sang milliseconds
  return Date.now() >= expirationTime;
};

/**
 * Lấy thông tin user từ JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Thông tin user hoặc null
 */
export const getUserFromToken = (token) => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  return {
    id: payload.id || payload.sub,
    cccd: payload.cccd || payload.username,
    roles: payload.roles || payload.authorities || [],
  };
};
