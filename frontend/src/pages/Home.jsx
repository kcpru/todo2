import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MdThumbUp, MdComment, MdMoreVert } from "react-icons/md";
import { usePostsAPI } from "../hooks/usePostsAPI";
import "./Home.scss";

export function Home() {
  const { getPosts } = usePostsAPI();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts(0);
        setPosts(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <div className="home-container">Loading posts...</div>;
  }

  if (error) {
    return <div className="home-container error">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="no-posts">No posts yet. Be the first to share!</div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              className="post-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                <div className="post-todo-preview">
                  <div className="preview-title">
                    {JSON.parse(post.todoListAsJson)?.name || "Todo List"}
                  </div>
                </div>
              )}

              <div className="post-actions">
                <button className="action-btn">
                  <MdThumbUp /> {post.likesCount || 0} Likes
                </button>
                <button className="action-btn">
                  <MdComment /> {post.comments?.length || 0} Comments
                </button>
              </div>

              {post.comments && post.comments.length > 0 && (
                <div className="post-comments">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <span className="comment-user">
                          User {comment.userId.slice(0, 8)}
                        </span>
                        <span className="comment-likes">
                          {comment.likesCount || 0} ❤
                        </span>
                      </div>
                      <div className="comment-text">{comment.commentText}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
