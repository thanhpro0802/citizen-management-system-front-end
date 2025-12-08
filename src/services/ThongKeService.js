import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/ThongKe';

export const ThongKe = () => axios.get(REST_API_BASE_URL);