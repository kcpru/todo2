import { useEffect, useRef, useState } from "react";
import { MdFavorite, MdSend } from "react-icons/md";
import { motion, useAnimationControls } from "motion/react";
import confetti from "canvas-confetti";
import { ModalForm } from "../ModalForm";
import { Comment } from "../Comment";
import { GradientButton } from "../GradientButton";
import { Input } from "../Input";
import { PostContent } from "../PostContent";
import { useDopamine } from "../../DopamineContext";
import { usePostsAPI } from "../../hooks/usePostsAPI";
import "./PostDetailModal.scss";

export function PostDetailModal({ post, isOpen, onClose, onPostUpdate }) {
  const { isDopamineMode } = useDopamine();
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [rippleEffects, setRippleEffects] = useState([]);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const likeButtonRef = useRef(null);
  const confettiInstanceRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const likeAnimationControls = useAnimationControls();
  const { commentOnPost, likePost, unlikePost } = usePostsAPI();

  useEffect(() => {
    return () => {
      if (confettiCanvasRef.current) {
        confettiCanvasRef.current.remove();
        confettiCanvasRef.current = null;
        confettiInstanceRef.current = null;
      }
    };
  }, []);

  const fireConfetti = (x, y) => {
    if (!confettiInstanceRef.current) {
      const canvas = document.createElement("canvas");
      canvas.style.position = "fixed";
      canvas.style.left = "0";
      canvas.style.top = "0";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "12000";
      document.body.appendChild(canvas);
      confettiCanvasRef.current = canvas;
      confettiInstanceRef.current = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });
    }

    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;

    const palette = ["#4355b9", "#5a6cc3", "#b8c3ff", "#dde1ff", "#ffffff"];
    const shapes = ["square", "circle", "star"];

    confettiInstanceRef.current({
      particleCount: 70,
      spread: 320,
      startVelocity: 18,
      decay: 0.9,
      scalar: 0.75,
      gravity: 0.8,
      origin: { x: normalizedX, y: normalizedY },
      shapes,
      colors: palette,
    });

    setTimeout(() => {
      confettiInstanceRef.current?.({
        particleCount: 40,
        spread: 320,
        startVelocity: 12,
        decay: 0.92,
        scalar: 0.65,
        gravity: 0.8,
        origin: { x: normalizedX, y: normalizedY },
        shapes,
        colors: palette,
      });
    }, 120);
  };

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

  useEffect(() => {
    setLikesCount(post?.likesCount || 0);
  }, [post?.id]);

  const handleLike = async () => {
    // Allow multiple likes: always send a POST like request and increment UI count
    try {
      // Run the like animation
      likeAnimationControls.start({
        scale: [1, 1.7, 1.05, 1],
        rotate: [0, -12, 2, 0],
        y: [0, -4, -2, 0],
        transition: {
          duration: 0.5,
          times: [0, 0.42, 0.72, 1],
          ease: [0.16, 1, 0.3, 1],
        },
      });

      if (likeButtonRef.current) {
        const buttonElement =
          likeButtonRef.current.querySelector("button") ||
          likeButtonRef.current;
        const rect = buttonElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        fireConfetti(x, y);
      }

      // Optimistically update UI
      setLikesCount((c) => c + 1);

      // Persist to backend (backend supports repeated likes)
      await likePost(post.id);

      if (onPostUpdate) {
        await onPostUpdate(post.id);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
      // Rollback optimistic increment
      setLikesCount((c) => Math.max(0, c - 1));
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
    <>
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
            post={{ ...post, likesCount }}
            onLike={handleLike}
            showCommentButton={false}
            mode="modal"
            likeButtonRef={likeButtonRef}
            likeAnimationControls={likeAnimationControls}
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
    </>
  );
}
