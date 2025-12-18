// Đổi chủ  hộ
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { thayDoiChuHo } from "services/hokhauService";
import { Paper, Typography, TextField, Button } from "@mui/material";

function DoiChuHo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cccdChuHoMoi, setCccdChuHoMoi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDoiChuHo = (e) => {
    e.preventDefault();
    setLoading(true);
    thayDoiChuHo(id, { cccdChuHoMoi })
      .then(() => {
        alert("Đổi chủ hộ thành công!");
        navigate(`/ho-khau/${id}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Paper style={{ padding: 24, maxWidth: 500, margin: "32px auto" }}>
      <Typography variant="h5">Thay đổi chủ hộ</Typography>
      <form onSubmit={handleDoiChuHo}>
        <TextField
          label="CCCD chủ hộ mới"
          value={cccdChuHoMoi}
          onChange={(e) => setCccdChuHoMoi(e.target.value)}
          fullWidth
          style={{ marginBottom: 24 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Đổi chủ hộ
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Hủy</Button>
      </form>
    </Paper>
  );
}

export default DoiChuHo;