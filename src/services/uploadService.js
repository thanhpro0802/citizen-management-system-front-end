import axios from "axios";

const CLOUD_NAME = "dzppgr7c1";
const UPLOAD_PRESET = "citizen";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dzppgr7c1/image/upload`;

/**
 * Upload một file lên Cloudinary và trả về URL
 * @param {File} file - Đối tượng File lấy từ input
 */
export const uploadFileToCloud = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url; // Trả về link ảnh thật
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    throw error;
  }
};
