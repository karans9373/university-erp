import axios from "axios";

function normalizeApiBaseUrl(url) {
  const base = (url || "http://localhost:5001/api").trim().replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const EXPORT_PDF_URL = `${API_BASE_URL}/exports/pdf`;
export const EXPORT_EXCEL_URL = `${API_BASE_URL}/exports/excel`;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export async function login(credentials) {
  try {
    const { data } = await client.post("/auth/login", credentials);
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Invalid email or password.");
    }

    if (error.response?.status >= 500) {
      throw new Error("The backend responded with a server error. Please wait a few seconds and try again.");
    }

    if (!error.response) {
      throw new Error(`The frontend could not reach ${API_BASE_URL}. Check Netlify environment variables and Render CORS settings.`);
    }

    throw new Error(error.response?.data?.message || "Login request failed.");
  }
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
