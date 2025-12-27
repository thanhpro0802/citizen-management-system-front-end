import axios from "axios";

// API Base URL - sử dụng cùng base URL với các service khác
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/api/chat`;

/**
 * Lấy JWT token từ localStorage
 * @returns {string|null} JWT token
 */
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

/**
 * Gửi tin nhắn đến AI chatbot
 * @param {string} message - Tin nhắn từ người dùng
 * @param {string|null} conversationId - ID của cuộc hội thoại (optional)
 * @returns {Promise} Response từ backend
 */
export const sendChatMessage = async (message, conversationId = null) => {
  try {
    // ✅ Lấy token
    const token = getAuthToken();

    if (!token) {
      throw new Error("Bạn chưa đăng nhập.  Vui lòng đăng nhập lại.");
    }

    // ✅ DEBUG: Log request
    console.log("Sending chat message:", { message, conversationId });

    const response = await axios.post(
      `${API_URL}/message`,
      {
        message,
        conversationId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Thêm token
        },
      }
    );

    // ✅ DEBUG: Log response
    console.log("Chat API raw response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error sending chat message:", error);

    // ✅ Xử lý lỗi 401
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    }

    throw new Error(error.response?.data?.message || "Không thể gửi tin nhắn. Vui lòng thử lại.");
  }
};

/**
 * Xóa lịch sử cuộc trò chuyện
 * @param {string} conversationId - ID của cuộc hội thoại
 * @returns {Promise} Response từ backend
 */
export const clearConversation = async (conversationId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
    }

    const response = await axios.delete(`${API_URL}/conversation/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error clearing conversation:", error);

    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    }

    throw new Error(error.response?.data?.message || "Không thể xóa lịch sử hội thoại.");
  }
};
