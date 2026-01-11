// Modern easing functions using cubic-bezier curves
const EASES = {
  smooth: [0.4, 0.0, 0.2, 1.0], // Smooth, elegant ease-out
  snappy: [0.34, 1.56, 0.64, 1], // Bouncy, modern spring-like
  fluid: [0.25, 0.46, 0.45, 0.94], // Balanced, smooth entrance
};

// Animation constants - modern minimalist style (fast entrance, slow exit)
export const ANIMATION_CONFIG = {
  // Fast entrance (0.15s), smooth ease-out
  fast: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15, ease: EASES.smooth },
  },
  // Dropdown menu - quick fade in/out
  dropdown: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: {
      opacity: { duration: 0.15 },
      y: { duration: 0.2, ease: EASES.snappy },
    },
  },
  // List items - slide in from left with stagger
  listItem: (index) => ({
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
    transition: {
      opacity: { duration: 0.1 },
      x: { duration: 0.2, ease: EASES.smooth },
      delay: index * 0.03, // Stagger delay: 30ms between each item
    },
  }),
  // Smooth page transitions
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      opacity: { duration: 0.2, ease: EASES.smooth },
    },
  },
  // Auth page - card entrance
  authCard: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASES.smooth },
  },
  // Auth page - icon animation
  authIcon: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { duration: 0.5, delay: 0.1, ease: EASES.snappy },
  },
  // Auth page - form group with stagger
  authFormGroup: (delay = 0) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay, ease: EASES.fluid },
  }),
  // Auth page - error message
  authError: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: EASES.smooth },
  },
  // Auth page - button and footer elements
  authButton: (delay = 0) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASES.snappy },
  }),
  // Validation - shake animation for invalid fields
  shake: {
    animate: {
      x: [0, -5, 5, -5, 0],
    },
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};
