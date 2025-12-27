import MDBox from "components/MDBox";

function TypingIndicator() {
  return (
    <MDBox display="flex" justifyContent="flex-start" mb={2}>
      <MDBox
        p={1.5}
        borderRadius="lg"
        sx={{
          backgroundColor: "#f0f2f5",
          display: "flex",
          gap: "6px",
          alignItems: "center",
          "@keyframes bounce": {
            "0%, 80%, 100%": {
              transform: "scale(0)",
            },
            "40%": {
              transform: "scale(1)",
            },
          },
        }}
      >
        <MDBox
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#7b809a",
            animation: "bounce 1.4s infinite ease-in-out both",
            animationDelay: "-0.32s",
          }}
        />
        <MDBox
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#7b809a",
            animation: "bounce 1.4s infinite ease-in-out both",
            animationDelay: "-0.16s",
          }}
        />
        <MDBox
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#7b809a",
            animation: "bounce 1.4s infinite ease-in-out both",
          }}
        />
      </MDBox>
    </MDBox>
  );
}

export default TypingIndicator;
