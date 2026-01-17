import { useState, useEffect } from "react";
import { MdThumbUp, MdComment, MdMoreVert, MdFavorite } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { usePostsAPI } from "../hooks/usePostsAPI";
import { Comment } from "../components/Comment";
import { GradientButton } from "../components/GradientButton";
import "./Home.scss";

function PostCard({ post }) {
  const [commentLikes, setCommentLikes] = useState({});
  const [rippleEffects, setRippleEffects] = useState([]);

  const handleDoubleTap = (commentId, x, y) => {
    // Add like
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));

    // Create ripple effect
    const rippleId = Date.now();
    setRippleEffects((prev) => [...prev, { id: rippleId, x, y, commentId }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRippleEffects((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1000);
  };

  return (
    <div className="post-card">
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
        <GradientButton
          variant="secondary"
          size="sm"
          icon={<MdThumbUp />}
          onClick={() => {
            // optional: handle like action here
          }}
        >
          {post.likesCount || 0} Likes
        </GradientButton>
        <GradientButton
          variant="secondary"
          size="sm"
          icon={<MdComment />}
          onClick={() => {
            // optional: handle comment action here
          }}
        >
          {post.comments?.length || 0} Comments
        </GradientButton>
      </div>

      {post.comments && post.comments.length > 0 && (
        <div className="post-comments">
          {post.comments.map((comment) => {
            const extraLikes = commentLikes[comment.id] || 0;
            const totalLikes = (comment.likesCount || 0) + extraLikes;
            const commentRipples = rippleEffects.filter(
              (r) => r.commentId === comment.id
            );

            return (
              <div key={comment.id} style={{ position: "relative" }}>
                <Comment
                  comment={{ ...comment, likesCount: totalLikes }}
                  onDoubleTap={handleDoubleTap}
                />
                {commentRipples.map((ripple) => (
                  <div
                    key={ripple.id}
                    className="comment-ripple"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                    }}
                  >
                    <MdFavorite />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  }, [getPosts]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">
          <ImSpinner2 className="spinner-icon" />
        </div>
      </div>
    );
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
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
