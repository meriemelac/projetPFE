import axios from "axios";

// Créer une instance Axios réutilisable
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Ajouter un intercepteur pour inclure le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupérer le token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ajouter le token dans les headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
