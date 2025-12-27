import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { sendChatMessage } from "services/chatService";

const WELCOME_MESSAGE = `Xin chào! Tôi là trợ lý ảo của hệ thống quản lý công dân.
Tôi có thể giúp bạn về:
- Thủ tục hành chính
- Hướng dẫn sử dụng hệ thống
- Thông tin dịch vụ công

Bạn cần tôi giúp gì?`;

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: WELCOME_MESSAGE,
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputValue, conversationId);

      // Lưu conversation ID nếu có
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response.response || response.message || "Xin lỗi, tôi không hiểu câu hỏi của bạn.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        text: WELCOME_MESSAGE,
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);
    setConversationId(null);
  };

  return (
    <MDBox
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: { xs: "calc(100% - 40px)", sm: "400px" },
        maxWidth: "400px",
        height: { xs: "calc(100vh - 100px)", sm: "600px" },
        maxHeight: "600px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        animation: "slideUp 0.3s ease-out",
        "@keyframes slideUp": {
          from: {
            opacity: 0,
            transform: "translateY(20px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Header */}
      <MDBox
        p={2}
        sx={{
          background: "linear-gradient(195deg, #42424a 0%, #191919 100%)",
          borderRadius: "16px 16px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MDBox display="flex" alignItems="center" gap={1}>
          <Icon sx={{ color: "#ffffff", fontSize: "24px" }}>smart_toy</Icon>
          <MDTypography variant="h6" color="white" fontWeight="medium">
            Trợ lý Công dân AI
          </MDTypography>
        </MDBox>
        <MDBox display="flex" gap={0.5}>
          <IconButton
            size="small"
            onClick={handleClearChat}
            sx={{ color: "#ffffff" }}
            title="Xóa lịch sử chat"
          >
            <Icon>refresh</Icon>
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: "#ffffff" }}>
            <Icon>close</Icon>
          </IconButton>
        </MDBox>
      </MDBox>

      <Divider />

      {/* Messages Area */}
      <MDBox
        p={2}
        sx={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#ffffff",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f2f5",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c4c4c4",
            borderRadius: "3px",
          },
        }}
      >
        {messages.map((msg) => (
          <Message key={msg.id} message={msg.text} isUser={msg.isUser} timestamp={msg.timestamp} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </MDBox>

      <Divider />

      {/* Input Area */}
      <MDBox p={2} sx={{ backgroundColor: "#f8f9fa" }}>
        <MDBox display="flex" gap={1}>
          <MDInput
            fullWidth
            multiline
            maxRows={3}
            placeholder="Nhập câu hỏi của bạn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              backgroundColor: "#ffffff",
              "& .MuiInputBase-input": {
                fontSize: "0.875rem",
              },
            }}
          />
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            sx={{
              minWidth: "48px",
              height: "40px",
              padding: "8px",
            }}
          >
            <Icon>send</Icon>
          </MDButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

ChatWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChatWindow;
