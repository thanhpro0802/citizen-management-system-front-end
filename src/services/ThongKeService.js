import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/ThongKe/QueQuan';

export const getThongKe = () => axios.get(REST_API_BASE_URL);