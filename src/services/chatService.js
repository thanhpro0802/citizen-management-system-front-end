import axios from "axios";

// API Base URL - sử dụng cùng base URL với các service khác
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/api/chat`;

/**
 * Gửi tin nhắn đến AI chatbot
 * @param {string} message - Tin nhắn từ người dùng
 * @param {string|null} conversationId - ID của cuộc hội thoại (optional)
 * @returns {Promise} Response từ backend
 */
export const sendChatMessage = async (message, conversationId = null) => {
  try {
    const response = await axios.post(
      `${API_URL}/message`,
      {
        message,
        conversationId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

/**
 * Xóa lịch sử cuộc trò chuyện
 * @param {string} conversationId - ID của cuộc hội thoại
 * @returns {Promise} Response từ backend
 */
export const clearConversation = async (conversationId) => {
  try {
    const response = await axios.delete(`${API_URL}/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error clearing conversation:", error);
    throw new Error(error.response?.data?.message || "Failed to clear conversation");
  }
};
