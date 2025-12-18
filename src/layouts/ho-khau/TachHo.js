// Giao diện tách hộ
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tachHo } from "services/hokhauService";
import { Paper, Typography, TextField, Button } from "@mui/material";

function TachHo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cccdThanhVien, setCccdThanhVien] = useState("");
  const [diaChiMoi, setDiaChiMoi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTachHo = (e) => {
    e.preventDefault();
    setLoading(true);
    tachHo(id, { cccdThanhVien, diaChiMoi })
      .then(() => {
        alert("Tách hộ thành công!");
        navigate("/ho-khau");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Paper style={{ padding: 24, maxWidth: 500, margin: "32px auto" }}>
      <Typography variant="h5">Tách hộ khỏi hộ khẩu</Typography>
      <form onSubmit={handleTachHo}>
        <TextField
          label="CCCD thành viên tách"
          value={cccdThanhVien}
          onChange={(e) => setCccdThanhVien(e.target.value)}
          fullWidth
          style={{ marginBottom: 16 }}
        />
        <TextField
          label="Địa chỉ hộ mới"
          value={diaChiMoi}
          onChange={(e) => setDiaChiMoi(e.target.value)}
          fullWidth
          style={{ marginBottom: 24 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Tách hộ
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Hủy</Button>
      </form>
    </Paper>
  );
}

export default TachHo;