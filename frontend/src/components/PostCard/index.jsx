import { motion } from "motion/react";
import { PostContent } from "../PostContent";
import "./PostCard.scss";

export function PostCard({ post, onClick, isSelected, currentUserId }) {
  // Get IDs of comments made by current user
  const userCommentIds =
    post.comments?.filter((c) => c.userId === currentUserId).map((c) => c.id) ||
    [];

  return (
    <motion.div
      className="post-card"
      onClick={onClick}
      layoutId={`post-${post.id}`}
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 1,
          restDelta: 0.001,
        },
        default: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isSelected ? 0 : 1 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <PostContent
          post={post}
          showCommentButton={true}
          mode="card"
          userCommentIds={userCommentIds}
        />
      </motion.div>
    </motion.div>
  );
}
