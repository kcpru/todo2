import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export function usePostsAPI() {
  const { token } = useAuth();

  const getPosts = useCallback(
    async (startIndex = 0) => {
      try {
        const response = await fetch(
          `${API_URL}/post?startIndex=${startIndex}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        return await response.json();
      } catch (err) {
        console.error("Error fetching posts:", err);
        throw err;
      }
    },
    [token]
  );

  const getPost = useCallback(
    async (postId) => {
      try {
        const response = await fetch(`${API_URL}/post/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch post");
        return await response.json();
      } catch (err) {
        console.error("Error fetching post:", err);
        throw err;
      }
    },
    [token]
  );

  const createPost = useCallback(
    async (todoListId, content) => {
      try {
        const response = await fetch(`${API_URL}/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ todoListId, content }),
        });
        if (!response.ok) throw new Error("Failed to create post");
        return await response.json();
      } catch (err) {
        console.error("Error creating post:", err);
        throw err;
      }
    },
    [token]
  );

  const likePost = useCallback(
    async (postId) => {
      try {
        const response = await fetch(`${API_URL}/post/${postId}/likes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ LikesCount: 1 }), // ASP.NET wymaga LikesCount
        });
        if (!response.ok) throw new Error("Failed to like post");
        return await response.json();
      } catch (err) {
        console.error("Error liking post:", err);
        throw err;
      }
    },
    [token]
  );

  const unlikePost = useCallback(
    async (postId) => {
      try {
        const response = await fetch(`${API_URL}/post/${postId}/likes`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to unlike post");
        return await response.json();
      } catch (err) {
        console.error("Error unliking post:", err);
        throw err;
      }
    },
    [token]
  );

  const commentOnPost = useCallback(
    async (postId, commentText) => {
      try {
        const response = await fetch(`${API_URL}/post/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ commentText }),
        });
        if (!response.ok) throw new Error("Failed to comment on post");
        return await response.json();
      } catch (err) {
        console.error("Error commenting on post:", err);
        throw err;
      }
    },
    [token]
  );

  const likeComment = useCallback(
    async (commentId) => {
      try {
        const response = await fetch(
          `${API_URL}/post/comments/${commentId}/likes`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to like comment");
        return await response.json();
      } catch (err) {
        console.error("Error liking comment:", err);
        throw err;
      }
    },
    [token]
  );

  const unlikeComment = useCallback(
    async (commentId) => {
      try {
        const response = await fetch(
          `${API_URL}/post/comments/${commentId}/likes`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to unlike comment");
        return await response.json();
      } catch (err) {
        console.error("Error unliking comment:", err);
        throw err;
      }
    },
    [token]
  );

  return {
    getPosts,
    getPost,
    createPost,
    likePost,
    unlikePost,
    commentOnPost,
    likeComment,
    unlikeComment,
  };
}
