import { useState } from "react";
import { MdFavorite, MdSend } from "react-icons/md";
import { motion } from "motion/react";
import { ModalForm } from "../ModalForm";
import { Comment } from "../Comment";
import { GradientButton } from "../GradientButton";
import { Input } from "../Input";
import { PostContent } from "../PostContent";
import { usePostsAPI } from "../../hooks/usePostsAPI";
import "./PostDetailModal.scss";

export function PostDetailModal({ post, isOpen, onClose, onPostUpdate }) {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [rippleEffects, setRippleEffects] = useState([]);
  const { commentOnPost, likePost, unlikePost } = usePostsAPI();

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submitting) return;

    try {
      setSubmitting(true);
      await commentOnPost(post.id, commentText);
      setCommentText("");
      if (onPostUpdate) {
        await onPostUpdate(post.id);
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    try {
      if (post.isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
      if (onPostUpdate) {
        await onPostUpdate(post.id);
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  const handleDoubleTap = (commentId, x, y) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));

    const rippleId = Date.now();
    setRippleEffects((prev) => [...prev, { id: rippleId, x, y, commentId }]);

    setTimeout(() => {
      setRippleEffects((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1000);
  };

  if (!post) return null;

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`Todo: ${post.id.slice(0, 8)}`}
      showFooter={false}
      showCloseButton={true}
      layoutId={`post-${post.id}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <PostContent
          post={post}
          onLike={handleLike}
          showCommentButton={false}
          mode="modal"
        />
      </motion.div>

      <motion.div
        className="post-detail-comments-section"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <h3 className="comments-title">
          Comments ({post.comments?.length || 0})
        </h3>

        <Input
          isTextarea
          containerClassName="comment-input-wrapper"
          className="comment-textarea"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          characterLimit={500}
          rows={3}
          disabled={submitting}
        >
          <GradientButton
            size="sm"
            icon={<MdSend />}
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || submitting}
            className="comment-submit-btn"
          >
            {submitting ? "..." : ""}
          </GradientButton>
        </Input>

        <div className="post-detail-comments">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => {
              const extraLikes = commentLikes[comment.id] || 0;
              const totalLikes = (comment.likesCount || 0) + extraLikes;
              const commentRipples = rippleEffects.filter(
                (r) => r.commentId === comment.id
              );

              return (
                <motion.div
                  key={comment.id}
                  style={{ position: "relative" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.4 + 0.08 * index,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
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
                </motion.div>
              );
            })
          ) : (
            <div className="no-comments">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </motion.div>
    </ModalForm>
  );
}
