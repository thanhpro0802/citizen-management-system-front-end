// Form thêm/sửa hộ khẩu
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchHoKhauDetail, createHoKhau, updateHoKhau } from "services/hokhauService";
import { Paper, TextField, Button, Typography } from "@mui/material";

function HoKhauForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    maHoKhau: "",
    diaChi: "",
    chuHoCccd: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchHoKhauDetail(id).then(res => {
        setForm({
          maHoKhau: res.data.maHoKhau || "",
          diaChi: res.data.diaChi || "",
          chuHoCccd: res.data.chuHo?.cccd || "",
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEdit) {
      updateHoKhau(id, form).then(() => navigate(`/ho-khau/${id}`));
    } else {
      createHoKhau(form).then(() => navigate("/ho-khau"));
    }
  };

  return (
    <Paper style={{ padding: 24, maxWidth: 500, margin: "32px auto" }}>
      <Typography variant="h5">{isEdit ? "Cập nhật" : "Tạo mới"} hộ khẩu</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Mã hộ khẩu"
          name="maHoKhau"
          value={form.maHoKhau}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
        />
        <TextField
          label="Địa chỉ"
          name="diaChi"
          value={form.diaChi}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
        />
        <TextField
          label="CCCD chủ hộ"
          name="chuHoCccd"
          value={form.chuHoCccd}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: 24 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Hủy</Button>
      </form>
    </Paper>
  );
}

export default HoKhauForm;