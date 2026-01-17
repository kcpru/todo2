import { MdThumbUp, MdComment } from "react-icons/md";
import { motion } from "motion/react";
import { GradientButton } from "../GradientButton";
import { TodoListPreview } from "../TodoListPreview";
import "./PostContent.scss";

export function PostContent({
  post,
  onLike,
  showCommentButton = true,
  mode = "card",
}) {
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
          <span className="post-stat">
            <MdThumbUp /> {post.likesCount || 0} Likes
          </span>
          {showCommentButton && (
            <span className="post-stat">
              <MdComment /> {post.comments?.length || 0} Comments
            </span>
          )}
        </div>
      ) : (
        <div className="post-actions">
          <motion.div
            initial={false}
            animate={post.isLiked ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            whileTap={{ scale: 0.95 }}
          >
            <GradientButton
              variant={post.isLiked ? "primary" : "secondary"}
              size="sm"
              icon={<MdThumbUp />}
              onClick={onLike}
            >
              {post.likesCount || 0} Likes
            </GradientButton>
          </motion.div>
          {showCommentButton && (
            <GradientButton variant="secondary" size="sm" icon={<MdComment />}>
              {post.comments?.length || 0} Comments
            </GradientButton>
          )}
        </div>
      )}
    </div>
  );
}
