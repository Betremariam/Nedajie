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
export const changePassword = (data) => API.post("/admin-auth/change-password", data);

// Federal APIs
export const createRegionalSuperAdmin = (data) => API.post("/federal/create-super-admin", data, { headers: { "Content-Type": "multipart/form-data" } });
export const createOwner = (data) => API.post("/federal/create-owner", data, { headers: { "Content-Type": "multipart/form-data" } });
export const addFuelDelivery = (data) => API.post("/federal/add-fuel", data);
export const getFederalDashboardStats = () => API.get("/federal/dashboard-stats");
export const getAllFederalFuelDeliveries = () => API.get("/federal/fuel-deliveries");

// Fuel Workflow APIs
export const getPendingDeliveriesForSuperAdmin = () => API.get("/fuel-workflow/super/pending");
export const confirmDeliveryBySuperAdmin = (deliveryId) => API.put(`/fuel-workflow/super/confirm/${deliveryId}`);
export const getPendingDeliveriesForOwner = () => API.get("/fuel-workflow/owner/pending");
export const acceptDeliveryByOwner = (deliveryId) => API.put(`/fuel-workflow/owner/accept/${deliveryId}`);

// Super Admin APIs (Original but now regionally filtered in backend)
export const getAllAdmins = () => API.get("/admins/admins");
export const blockAdmin = (id) => API.patch(`/admins/admins/${id}/block`);
export const getAllFuelTransactions = () => API.get("/admins/transactions");
export const getAllFuelStocks = () => API.get("/admins/fuel-stocks");
export const getVehicles = () => API.get("/admins/vehicles");
export const getFarmers = () => API.get("/admins/farmers");
export const getOthers = () => API.get("/admins/others");
export const getSuperAdminDashboardStats = () => API.get("/admins/dashboard-stats");

export default API;
