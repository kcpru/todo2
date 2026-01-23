
import { useEffect, useState } from "react";
import "./MotivationMessage.scss";

const AVATAR_ENDPOINT = "/api/motivation/random-avatar/bottts";

export default function MotivationMessage({ message }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    let revoked = false;
    async function fetchAvatar() {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(AVATAR_ENDPOINT, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!resp.ok) return;
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        if (!revoked) setAvatarUrl(url);
      } catch {}
    }
    fetchAvatar();
    return () => {
      revoked = true;
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
    // eslint-disable-next-line
  }, []);

  if (!message) return null;
  return (
    <div className="motivation-message">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Bottts avatar"
          className="motivation-avatar"
          width={36}
          height={36}
          style={{ minWidth: 36, minHeight: 36, borderRadius: "50%" }}
        />
      ) : (
        <span role="img" aria-label="Motivation">💡</span>
      )}
      {message}
    </div>
  );
}
