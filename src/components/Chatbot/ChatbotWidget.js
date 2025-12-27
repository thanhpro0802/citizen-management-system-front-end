import { useState } from "react";
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import ChatWindow from "./ChatWindow";

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Tooltip title="Trợ lý AI" placement="left">
        <Fab
          color="primary"
          aria-label="chatbot"
          onClick={handleToggle}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 999,
            background: "linear-gradient(195deg, #42424a 0%, #191919 100%)",
            color: "#ffffff",
            width: 56,
            height: 56,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.3)",
            },
            animation: isOpen ? "none" : "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              },
              "50%": {
                boxShadow: "0 4px 30px rgba(66, 66, 74, 0.6)",
              },
              "100%": {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              },
            },
          }}
        >
          {isOpen ? (
            <Icon sx={{ fontSize: 28 }}>close</Icon>
          ) : (
            <Icon sx={{ fontSize: 28 }}>smart_toy</Icon>
          )}
        </Fab>
      </Tooltip>

      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={handleToggle} />}

      {/* Overlay for mobile */}
      {isOpen && (
        <MDBox
          onClick={handleToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
        />
      )}
    </>
  );
}

export default ChatbotWidget;
