/**
 * Service để gọi API quản lý nhân khẩu
 * TỰ ĐỘNG GẮN JWT TOKEN CHO TẤT CẢ REQUEST
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

/**
 * Helper fetch có gắn Authorization
 */
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token"); // ⚠️ đúng key token bạn lưu khi login

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Nếu token hết hạn / không hợp lệ
  if (response.status === 401 || response.status === 403) {
    console.error("Unauthorized - token invalid or expired");
    // Optional: redirect về login
    // window.location.href = '/authentication/sign-in';
  }

  return response;
};

class NhanKhauService {
  /**
   * Lấy danh sách nhân khẩu (tìm kiếm + phân trang)
   */
  async searchNhanKhau(criteria = {}, page = 0, size = 10) {
    const filteredCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filteredCriteria,
    });

    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau?${params}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Lỗi khi tải danh sách nhân khẩu");
    }

    return await response.json(); // { content, totalPages, totalElements }
  }

  /**
   * Lấy chi tiết nhân khẩu
   */
  async getNhanKhauById(maNhanKhau) {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau/${maNhanKhau}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Không tìm thấy nhân khẩu");
    }

    return await response.json();
  }

  /**
   * Tạo mới nhân khẩu
   */
  async createNhanKhau(data) {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Lỗi khi tạo nhân khẩu");
    }

    return await response.json();
  }

  /**
   * Cập nhật nhân khẩu
   */
  async updateNhanKhau(maNhanKhau, data) {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau/${maNhanKhau}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Lỗi khi cập nhật nhân khẩu");
    }

    return await response.json();
  }

  /**
   * Xóa nhân khẩu
   */
  async deleteNhanKhau(maNhanKhau) {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau/${maNhanKhau}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Lỗi khi xóa nhân khẩu");
    }

    return true;
  }

  /**
   * Đăng ký tạm trú
   */
  async registerTamTru(data) {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau/${data.maNhanKhau}/tam-tru`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Lỗi khi đăng ký tạm trú");
    }

    return await response.json();
  }

  /**
   * Đăng ký tạm vắng
   */
  async registerTamVang(data) {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau/${data.maNhanKhau}/tam-vang`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Lỗi khi đăng ký tạm vắng");
    }

    return await response.json();
  }

  /**
   * Khai tử
   */
  async declareDeath(maNhanKhau) {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau/${maNhanKhau}/khai-tu`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Lỗi khi khai tử");
    }

    return await response.json();
  }

  /**
   * API mới: Lấy thông tin nhân khẩu của công dân đang đăng nhập
   * Trả về thông tin nhân khẩu của bản thân + danh sách thành viên cùng hộ khẩu
   */
  async layThongTinNhanKhauCuaToi() {
    const response = await fetchWithAuth(`${API_BASE_URL}/nhan-khau/cua-toi`, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Lỗi khi lấy thông tin nhân khẩu");
    }

    return await response.json();
  }
}

export default new NhanKhauService();
