import axios from "axios";

// Base API URL for residence requests
const API_URL = "http://localhost:8080/api/yeu-cau-cu-tru";

// Get authorization headers with token
const getAuthHeaders = () => {
let token = localStorage.getItem("token");

// If token not found directly, look in user object
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

const yeuCauCuTruService = {
// ========== CITIZEN APIs ==========

/**
 * Tạo yêu cầu cư trú mới (CONG_DAN)
 * @param {Object} data - Request data
 */
taoYeuCau: (data) => axios.post(API_URL, data, { headers: getAuthHeaders() }),

/**
 * Lấy danh sách yêu cầu của tôi (CONG_DAN)
 */
layYeuCauCuaToi: () => axios.get(`${API_URL}/cua-toi`, { headers: getAuthHeaders() }),

/**
 * Lấy chi tiết yêu cầu
 * @param {string} maYeuCau - Request ID
 */
layChiTiet: (maYeuCau) => axios.get(`${API_URL}/${maYeuCau}`, { headers: getAuthHeaders() }),

/**
 * Hủy yêu cầu (CONG_DAN - chỉ khi đang chờ xử lý)
 * @param {string} maYeuCau - Request ID
 */
huyYeuCau: (maYeuCau) =>
    axios.put(`${API_URL}/${maYeuCau}/huy`, {}, { headers: getAuthHeaders() }),

// ========== STAFF APIs ==========

/**
 * Lấy tất cả yêu cầu (CAN_BO, ADMIN)
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 */
layTatCaYeuCau: (page = 0, size = 10) =>
    axios.get(API_URL, {
    params: { page, size },
    headers: getAuthHeaders(),
    }),

/**
 * Tìm kiếm yêu cầu theo tiêu chí (CAN_BO, ADMIN)
 * @param {Object} filters - Search filters
 * @param {string} filters.trangThai - Request status
 * @param {string} filters.loaiYeuCau - Request type
 * @param {number} page - Page number
 * @param {number} size - Page size
 */
timKiemYeuCau: ({ trangThai, loaiYeuCau }, page = 0, size = 10) =>
    axios.get(`${API_URL}/tim-kiem`, {
    params: { trangThai, loaiYeuCau, page, size },
    headers: getAuthHeaders(),
    }),

/**
 * Xử lý yêu cầu (CAN_BO, ADMIN)
 * @param {string} maYeuCau - Request ID
 * @param {Object} data - Processing data
 * @param {string} data.trangThaiMoi - New status
 * @param {string} data.ghiChu - Notes
 * @param {string} data.lyDoTuChoi - Rejection reason
 */
xuLyYeuCau: (maYeuCau, data) =>
    axios.put(`${API_URL}/${maYeuCau}/xu-ly`, data, { headers: getAuthHeaders() }),

/**
 * Phê duyệt yêu cầu (CAN_BO, ADMIN)
 * @param {string} maYeuCau - Request ID
 * @param {string} ghiChu - Optional notes
 */
pheDuyetYeuCau: (maYeuCau, ghiChu = "") =>
    axios.put(
    `${API_URL}/${maYeuCau}/phe-duyet`,
    {},
    {
        params: { ghiChu },
        headers: getAuthHeaders(),
    }
    ),

/**
 * Từ chối yêu cầu (CAN_BO, ADMIN)
 * @param {string} maYeuCau - Request ID
 * @param {string} lyDoTuChoi - Rejection reason
 */
tuChoiYeuCau: (maYeuCau, lyDoTuChoi) =>
    axios.put(
    `${API_URL}/${maYeuCau}/tu-choi`,
    {},
    {
        params: { lyDoTuChoi },
        headers: getAuthHeaders(),
    }
    ),

/**
 * Thống kê số lượng yêu cầu theo trạng thái (CAN_BO, ADMIN)
 */
thongKeYeuCau: () => axios.get(`${API_URL}/thong-ke`, { headers: getAuthHeaders() }),

/**
 * Đếm số yêu cầu chờ xử lý (CAN_BO, ADMIN)
 */
demYeuCauChoXuLy: () => axios.get(`${API_URL}/dem-cho-xu-ly`, { headers: getAuthHeaders() }),
};

// Named exports for easier imports
export const taoYeuCau = (data) =>
yeuCauCuTruService.taoYeuCau(data).then((res) => res.data);

export const getYeuCauCuaToi = () =>
yeuCauCuTruService.layYeuCauCuaToi().then((res) => {
    // Handle both paginated and direct array responses
    if (res.data && res.data.content) {
    return res.data.content;
    }
    return Array.isArray(res.data) ? res.data : [];
});
export const getChiTietYeuCau = (maYeuCau) =>
yeuCauCuTruService.layChiTiet(maYeuCau).then((res) => res.data);

export const huyYeuCau = (maYeuCau) =>
yeuCauCuTruService.huyYeuCau(maYeuCau).then((res) => res.data);

export const getAllYeuCau = (page = 0, size = 1000) =>
yeuCauCuTruService.layTatCaYeuCau(page, size).then((res) => {
    // If response has paginated structure, extract content array
    if (res.data && res.data.content) {
    return res.data.content;
    }
    // Otherwise return data directly (could be array or object)
    return Array.isArray(res.data) ? res.data : [];
});

export const timKiemYeuCau = (filters, page = 0, size = 10) =>
yeuCauCuTruService.timKiemYeuCau(filters, page, size).then((res) => {
    // Handle paginated response
    if (res.data && res.data.content) {
    return res.data.content;
    }
    return Array.isArray(res.data) ? res.data : [];
});

export const xuLyYeuCau = (maYeuCau, data) =>
yeuCauCuTruService.xuLyYeuCau(maYeuCau, data).then((res) => res.data);

export const pheDuyetYeuCau = (maYeuCau, data) =>
yeuCauCuTruService.pheDuyetYeuCau(maYeuCau, data.ghiChu || "").then((res) => res.data);

export const tuChoiYeuCau = (maYeuCau, data) =>
yeuCauCuTruService.tuChoiYeuCau(maYeuCau, data.lyDoTuChoi).then((res) => res.data);

export const nhanXuLyYeuCau = (maYeuCau) =>
axios
    .put(`${API_URL}/${maYeuCau}/nhan-xu-ly`, {}, { headers: getAuthHeaders() })
    .then((res) => res.data);

export const thongKeYeuCau = () =>
yeuCauCuTruService.thongKeYeuCau().then((res) => res.data);

export const demYeuCauChoXuLy = () =>
yeuCauCuTruService.demYeuCauChoXuLy().then((res) => res.data);

export default yeuCauCuTruService;
