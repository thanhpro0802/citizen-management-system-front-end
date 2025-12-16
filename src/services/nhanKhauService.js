/**
 * Service để gọi API quản lý nhân khẩu
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class NhanKhauService {
  /**
   * Lấy danh sách nhân khẩu với phân trang và tìm kiếm
   */
  async searchNhanKhau(criteria = {}, page = 0, size = 10) {
    // Filter out empty values
    const filteredCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filteredCriteria,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/nhan-khau?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải danh sách nhân khẩu');
      }

      const data = await response.json();
      // Trả về data ngay cả khi content rỗng
      return data;
    } catch (error) {
      console.error('Error fetching nhan khau:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết nhân khẩu
   */
  async getNhanKhauById(maNhanKhau) {
    const response = await fetch(`${API_BASE_URL}/nhan-khau/${maNhanKhau}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Không tìm thấy nhân khẩu');
    }

    return await response.json();
  }

  /**
   * Tạo mới nhân khẩu
   */
  async createNhanKhau(data) {
    const response = await fetch(`${API_BASE_URL}/nhan-khau`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Lỗi khi tạo nhân khẩu');
    }

    return await response.json();
  }

  /**
   * Cập nhật thông tin nhân khẩu
   */
  async updateNhanKhau(maNhanKhau, data) {
    const response = await fetch(`${API_BASE_URL}/nhan-khau/${maNhanKhau}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Lỗi khi cập nhật nhân khẩu');
    }

    return await response.json();
  }

  /**
   * Xóa nhân khẩu
   */
  async deleteNhanKhau(maNhanKhau) {
    const response = await fetch(`${API_BASE_URL}/nhan-khau/${maNhanKhau}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi xóa nhân khẩu');
    }

    return true;
  }

  /**
   * Đăng ký tạm trú
   */
  async registerTamTru(data) {
    const response = await fetch(`${API_BASE_URL}/nhan-khau/tam-tru`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Lỗi khi đăng ký tạm trú');
    }

    return await response.json();
  }

  /**
   * Đăng ký tạm vắng
   */
  async registerTamVang(data) {
    const response = await fetch(`${API_BASE_URL}/nhan-khau/tam-vang`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Lỗi khi đăng ký tạm vắng');
    }

    return await response.json();
  }

  /**
   * Khai tử
   */
  async declareDeath(maNhanKhau) {
    const response = await fetch(`${API_BASE_URL}/nhan-khau/${maNhanKhau}/khai-tu`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Lỗi khi khai tử');
    }

    return await response.json();
  }
}

export default new NhanKhauService();
