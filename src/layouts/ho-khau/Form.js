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
    diaChi: "",
    maNhanKhauChuHo: "",
    ngayDangKy: new Date().toISOString().slice(0, 10), // mặc định hôm nay
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchHoKhauDetail(id).then((res) => {
        setForm({
          maHoKhau: res.data.maHoKhau || "",
          diaChi: res.data.diaChi || "",
          maNhanKhauChuHo: res.data.chuHo?.maNhanKhau || "", // hoặc res.data.chuHo?.id
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Build body đúng chuẩn backend cần:
    const reqBody = {
      diaChi: form.diaChi,
      ngayDangKy: form.ngayDangKy,
      chuHo: { maNhanKhau: form.maNhanKhauChuHo },
    };
    if (isEdit) {
      updateHoKhau(id, reqBody).then(() => navigate(`/ho-khau/${id}`));
    } else {
      createHoKhau(reqBody).then(() => navigate("/ho-khau"));
    }
  };

  return (
    <Paper style={{ padding: 24, maxWidth: 500, margin: "32px auto" }}>
      <Typography variant="h5">{isEdit ? "Cập nhật" : "Tạo mới"} hộ khẩu</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Địa chỉ"
          name="diaChi"
          value={form.diaChi}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
        />

        <TextField
          label="Mã nhân khẩu chủ hộ (VD: NK0001)"
          name="maNhanKhauChuHo"
          value={form.maNhanKhauChuHo}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
        />

        <TextField
          label="Ngày đăng ký"
          name="ngayDangKy"
          type="date"
          value={form.ngayDangKy}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: 24 }}
          InputLabelProps={{ shrink: true }}
        />

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
          Hủy
        </Button>
      </form>
    </Paper>
  );
}

export default HoKhauForm;
