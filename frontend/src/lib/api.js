import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
export const EXPORT_PDF_URL = `${API_BASE_URL}/exports/pdf`;
export const EXPORT_EXCEL_URL = `${API_BASE_URL}/exports/excel`;

const client = axios.create({
  baseURL: API_BASE_URL,
});

export async function login(credentials) {
  const { data } = await client.post("/auth/login", credentials);
  return data;
}

export async function register(payload) {
  const { data } = await client.post("/auth/register", payload);
  return data;
}

export async function fetchDashboard(token) {
  const { data } = await client.get("/analytics/dashboard", authHeaders(token));
  return data;
}

export async function fetchCollection(path, token) {
  const { data } = await client.get(path, authHeaders(token));
  return data.items;
}

export async function askChatbot(message) {
  const { data } = await client.post("/chatbot", { message });
  return data.reply;
}

export async function createNotice(payload, token) {
  const { data } = await client.post("/notices", payload, authHeaders(token));
  return data;
}

export async function createAttendance(payload, token) {
  const { data } = await client.post("/attendance", payload, authHeaders(token));
  return data;
}

export async function createResult(payload, token) {
  const { data } = await client.post("/results", payload, authHeaders(token));
  return data;
}

export async function createStudent(payload, token) {
  const { data } = await client.post("/students", payload, authHeaders(token));
  return data;
}

function authHeaders(token) {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
