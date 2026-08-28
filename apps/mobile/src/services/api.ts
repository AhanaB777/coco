import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: [backend teammate] attach JWT from auth store when patient login is wired to API
