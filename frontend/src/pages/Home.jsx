import { useState, useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";
import { usePostsAPI } from "../hooks/usePostsAPI";
import { PostCard } from "../components/PostCard";
import { PostDetailModal } from "../components/PostDetailModal";
import "./Home.scss";

export function Home() {
  const { getPosts, getPost } = usePostsAPI();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handlePostClick = async (post) => {
    try {
      const fullPost = await getPost(post.id);
      setSelectedPost(fullPost);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to load post details:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handlePostUpdate = async (postId) => {
    try {
      const updatedPost = await getPost(postId);
      setSelectedPost(updatedPost);
      // Update in posts list
      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

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
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post)}
            />
          ))
        )}
      </div>

      <PostDetailModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPostUpdate={handlePostUpdate}
      />
    </div>
  );
}
