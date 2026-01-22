const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const DEFAULT_AVATAR_TYPE = "miniavs";

export async function generateRandomAvatar(type = DEFAULT_AVATAR_TYPE) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${API_URL}/motivation/random-avatar/${type}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch random avatar");
  }
  // Zwracamy URL do tymczasowego pliku SVG
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
