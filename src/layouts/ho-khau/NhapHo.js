// Giao diện nhập hộ
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { nhapHo } from "services/hokhauService";
import { Paper, Typography, TextField, Button } from "@mui/material";

function NhapHo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cccdThanhVien, setCccdThanhVien] = useState("");
  const [idHoKhauNhap, setIdHoKhauNhap] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNhapHo = (e) => {
    e.preventDefault();
    setLoading(true);
    nhapHo(id, { cccdThanhVien, idHoKhauNhap })
      .then(() => {
        alert("Nhập hộ thành công!");
        navigate("/ho-khau");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Paper style={{ padding: 24, maxWidth: 500, margin: "32px auto" }}>
      <Typography variant="h5">Nhập thành viên vào hộ khẩu khác</Typography>
      <form onSubmit={handleNhapHo}>
        <TextField
          label="CCCD thành viên"
          value={cccdThanhVien}
          onChange={(e) => setCccdThanhVien(e.target.value)}
          fullWidth
          style={{ marginBottom: 16 }}
        />
        <TextField
          label="ID hộ khẩu muốn nhập vào"
          value={idHoKhauNhap}
          onChange={(e) => setIdHoKhauNhap(e.target.value)}
          fullWidth
          style={{ marginBottom: 24 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Nhập hộ
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Hủy</Button>
      </form>
    </Paper>
  );
}

export default NhapHo;