import axios from "axios";

// Thông tin Cloudinary của bạn (Lấy từ ảnh bạn gửi)
const CLOUD_NAME = "dzppgr7c1";
const UPLOAD_PRESET = "citizen"; // Đảm bảo tên này đúng với trên web Cloudinary (chế độ Unsigned)

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "phan_anh_cong_dan");

  try {
    // 1. Tạo một instance Axios mới tinh (Không dính interceptor/token cũ của dự án)
    const uploadInstance = axios.create();

    // 2. Xóa sạch mọi header mặc định có thể gây lỗi (Authorization)
    delete uploadInstance.defaults.headers.common["Authorization"];

    // 3. Gửi bằng instance mới này
    const response = await uploadInstance.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    throw error;
  }
};
