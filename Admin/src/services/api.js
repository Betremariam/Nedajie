import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      localStorage.removeItem("stationIds");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Login function
export const loginAdmin = (credentials) => API.post("/admin-auth/login", credentials);

export default API;
