import toast from "react-hot-toast";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getGlobalLoadingSetter } from "../utils/loadingBridge";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: API_URL
});

/* -------------------- REQUEST INTERCEPTOR -------------------- */
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------------------- REFRESH LOGIC -------------------- */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* -------------------- RESPONSE INTERCEPTOR -------------------- */
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      isRefreshing = true;
      const setRefreshing = getGlobalLoadingSetter();
      setRefreshing?.(true);

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          "http://localhost:8000/auth/refresh",
          { refresh_token: refreshToken }
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.clear();
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        setRefreshing?.(false);
      }
    }

    toast.error(
      (error.response?.data as any)?.detail || "Something went wrong"
    );
    return Promise.reject(error);
  }
);

export default API;
