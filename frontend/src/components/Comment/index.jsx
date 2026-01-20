import { useRef } from "react";
import { useRipple } from "@hooks/useRipple";
import "./Comment.scss";
import { GoHeartFill } from "react-icons/go";

export function Comment({ comment, onDoubleTap }) {
  const lastTapRef = useRef(0);
  const { createRipple } = useRipple();

  const handleTap = (e) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDoubleTap(comment.id, x, y);
    } else {
      // Single tap - create ripple
      createRipple(e);
    }

    lastTapRef.current = now;
  };

  return (
    <div className="comment input-with-ripple" onClick={handleTap}>
      <div className="comment-header">
        <span className="comment-user">User {comment.userId.slice(0, 8)}</span>
        <span className="comment-likes">
          {comment.likesCount || 0}
          <GoHeartFill />
        </span>
      </div>
      <p className="comment-text">{comment.commentText || comment.text}</p>
    </div>
  );
}
