import axios from "axios";

// Đảm bảo URL này đúng với Backend của bạn
const API_URL = "http://localhost:8080/api/v1/phan-anh";

// --- QUAN TRỌNG: HÀM LẤY TOKEN (Không được xóa hàm này) ---
const getAuthHeaders = () => {
  let token = localStorage.getItem("token");

  // Nếu không thấy token rời, tìm trong object user
  if (!token) {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      token = user.token || user.accessToken;
    }
  }

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
// -----------------------------------------------------------

// --- CÁC API NGHIỆP VỤ ---

export const getAllPhanAnh = () => axios.get(API_URL, { headers: getAuthHeaders() });

export const guiPhanAnhMoi = (duLieu) => axios.post(API_URL, duLieu, { headers: getAuthHeaders() });

export const getPhanAnhCuaToi = () =>
  axios.get(`${API_URL}/cua-toi`, { headers: getAuthHeaders() });

export const getChiTietPhanAnh = (id) =>
  axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });

export const getLichSuPhanAnh = (id) =>
  axios.get(`${API_URL}/${id}/lich-su`, { headers: getAuthHeaders() });

// 1. Phân công xử lý (Dùng Mã Cán Bộ)
export const phanCongXuLy = (id, maCanBo, hanXuLy) => {
  return axios.put(
    `${API_URL}/${id}/phan-cong`,
    { maCanBoPhuTrach: maCanBo, thoiHanXuLy: hanXuLy },
    { headers: getAuthHeaders() }
  );
};

// 2. Ghi nhật ký xử lý (Nội bộ)
export const capNhatXuLyNoiBo = (id, textNoiDung) => {
  return axios.put(
    `${API_URL}/${id}/xu-ly`,
    { noiDung: textNoiDung, danhSachFileUrl: [] },
    { headers: getAuthHeaders() }
  );
};

// 3. Phản hồi công dân (Hoàn tất)
export const phanHoiCongDan = (id, noiDung) => {
  return axios.put(
    `${API_URL}/${id}/phan-hoi`,
    { noiDungPhanHoi: noiDung },
    { headers: getAuthHeaders() }
  );
};

// 4. Cập nhật mức độ khẩn cấp (Đã sửa lỗi ReferenceError tại đây)
export const updateMucDoKhanCap = (id, mucDo) => {
  // Đường dẫn API dựa trên log lỗi bạn cung cấp
  const url = `${API_URL}/${id}/muc-do-khan-cap`;

  return axios.put(
    url,
    { mucDo: mucDo }, // Gửi Body JSON
    {
      params: { mucDo: mucDo }, // Gửi kèm Params cho chắc chắn
      headers: getAuthHeaders(), // Gọi hàm lấy Token tại đây
    }
  );
};

// 5. Đánh giá (Công dân)
export const danhGiaPhanHoi = (id, soSao, gopY) => {
  return axios.put(
    `${API_URL}/${id}/danh-gia`,
    { danhGiaHaiLong: soSao, gopY: gopY },
    { headers: getAuthHeaders() }
  );
};
