import axios from "axios";
import { getCsrfToken } from "next-auth/react";

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
  config.headers["X-CSRF-Token"] = await getCsrfToken();
  return config;
});
