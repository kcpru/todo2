import { motion } from "motion/react";
import { PostContent } from "../PostContent";
import "./PostCard.scss";

export function PostCard({ post, onClick, isSelected }) {
  return (
    <motion.div
      className="post-card"
      onClick={onClick}
      layoutId={`post-${post.id}`}
      layout
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        },
        default: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isSelected ? 0 : 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <PostContent post={post} showCommentButton={true} />
      </motion.div>
    </motion.div>
  );
}
