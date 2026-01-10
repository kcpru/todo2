// Animation constants - modern minimalist style (fast entrance, slow exit)
export const ANIMATION_CONFIG = {
  // Fast entrance (0.15s), smooth ease-out
  fast: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15, ease: "easeOut" },
  },
  // Dropdown menu - quick fade in/out
  dropdown: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: {
      opacity: { duration: 0.15 },
      y: { duration: 0.2, ease: "easeOut" },
    },
  },
  // List items - slide in from left with stagger
  listItem: (index) => ({
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
    transition: {
      opacity: { duration: 0.1 },
      x: { duration: 0.2, ease: "easeOut" },
      delay: index * 0.03, // Stagger delay: 30ms between each item
    },
  }),
  // Smooth page transitions
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      opacity: { duration: 0.2, ease: "easeOut" },
    },
  },
};
