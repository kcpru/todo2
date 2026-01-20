const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

export async function uploadAvatar(file) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/user/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to upload avatar");
  }
  return true;
}

export function getAvatarUrl(userId = "me") {
  return `${API_URL}/user/${userId}/avatar`;
}
