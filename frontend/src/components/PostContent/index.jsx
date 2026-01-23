import { MdThumbUp, MdComment } from "react-icons/md";
import { motion } from "motion/react";
import { Button } from "../Button";
import { TodoListPreview } from "../TodoListPreview";
import "./PostContent.scss";

const AnimatedThumbUp = motion(MdThumbUp);

export function PostContent({
  post,
  onLike,
  showCommentButton = true,
  mode = "card",
  userCommentIds = [],
  likeButtonRef = null,
  likeAnimationControls = null,
}) {
  // Check if current user has commented on this post
  const userHasCommented = userCommentIds && userCommentIds.length > 0;

  return (
    <div className="post-content-wrapper">
      <div className="post-header">
        <div className="post-info">
          <div className="post-title">Todo: {post.id.slice(0, 8)}</div>
          <div className="post-time">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="post-text">{post.content}</div>

      {post.todoListAsJson && (
        <div className="post-todo-section">
          <TodoListPreview todoListJson={post.todoListAsJson} />
        </div>
      )}

      {mode === "card" ? (
        <div className="post-actions post-stats">
          <span
            className={`post-stat ${post.isLiked ? "post-stat-liked" : ""}`}
          >
            <MdThumbUp /> {post.likesCount || 0} Likes
          </span>
          {showCommentButton && (
            <span
              className={`post-stat ${userHasCommented ? "post-stat-commented" : ""}`}
            >
              <MdComment /> {post.comments?.length || 0} Comments
            </span>
          )}
        </div>
      ) : (
        <div className="post-actions">
          <Button
            ref={likeButtonRef}
            variant={post.isLiked ? "primary" : "secondary"}
            size="sm"
            icon={
              <AnimatedThumbUp
                animate={likeAnimationControls}
                transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              />
            }
            onClick={onLike}
          >
            {post.likesCount || 0} Likes
          </Button>
          {showCommentButton && (
            <Button variant="secondary" size="sm" icon={<MdComment />}>
              {post.comments?.length || 0} Comments
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
