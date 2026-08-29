import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Read the current token straight from localStorage on every request so the
// header always reflects the latest login state, even right after a login
// or logout, without needing to rebuild the axios instance.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token has expired or been rejected, clear it and let the app fall
// back to the login screen instead of showing a confusing broken dashboard.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("gms_token");
      localStorage.removeItem("gms_user");
    }
    return Promise.reject(error);
  }
);

export default api;
