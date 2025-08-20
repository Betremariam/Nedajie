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

// Login function
export const loginAdmin = (credentials) => API.post("/admin-auth/login", credentials);

export default API;
