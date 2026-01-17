import { MdThumbUp, MdComment } from "react-icons/md";
import { GradientButton } from "../GradientButton";
import { TodoListPreview } from "../TodoListPreview";
import "./PostCard.scss";

export function PostCard({ post, onClick }) {
  return (
    <div className="post-card" onClick={onClick}>
      <div className="post-header">
        <div className="post-info">
          <div className="post-title">Todo: {post.id.slice(0, 8)}</div>
          <div className="post-time">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="post-content">{post.content}</div>

      {post.todoListAsJson && (
        <div className="post-todo-section">
          <TodoListPreview todoListJson={post.todoListAsJson} />
        </div>
      )}

      <div className="post-actions">
        <GradientButton variant="secondary" size="sm" icon={<MdThumbUp />}>
          {post.likesCount || 0} Likes
        </GradientButton>
        <GradientButton variant="secondary" size="sm" icon={<MdComment />}>
          {post.comments?.length || 0} Comments
        </GradientButton>
      </div>
    </div>
  );
}
