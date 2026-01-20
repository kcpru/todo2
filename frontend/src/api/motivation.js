// API for motivation messages
import axios from "axios";

const API_URL = "/api/motivation";

export async function getMotivationMessage(taskTitle) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.post(
    `${API_URL}/list-done`,
    { taskTitle },
    { headers }
  );
  return response.data;
}
