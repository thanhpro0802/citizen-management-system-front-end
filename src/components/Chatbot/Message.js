import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Message({ message, isUser, timestamp }) {
  return (
    <MDBox
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={2}
      sx={{
        animation: "fadeIn 0.3s ease-in",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <MDBox
        maxWidth="75%"
        p={1.5}
        borderRadius="lg"
        sx={{
          backgroundColor: isUser ? "#1A73E8" : "#f0f2f5",
          color: isUser ? "#ffffff" : "#ffffff",
          wordBreak: "break-word",
        }}
      >
        <MDTypography
          variant="body2"
          color={isUser ? "white" : "dark"}
          sx={{
            whiteSpace: "pre-wrap",
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        >
          {message}
        </MDTypography>
        {timestamp && (
          <MDTypography
            variant="caption"
            color={isUser ? "white" : "text"}
            sx={{
              display: "block",
              mt: 0.5,
              fontSize: "0.7rem",
              opacity: 0.7,
            }}
          >
            {new Date(timestamp).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
}

Message.defaultProps = {
  timestamp: null,
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  timestamp: PropTypes.string,
};

export default Message;
