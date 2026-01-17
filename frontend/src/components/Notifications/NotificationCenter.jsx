import { AnimatePresence, motion } from "motion/react";
import {
  MdErrorOutline,
  MdCheckCircleOutline,
  MdInfoOutline,
  MdWarningAmber,
  MdClose,
} from "react-icons/md";
import "./NotificationCenter.scss";

const ICONS = {
  error: <MdErrorOutline />,
  success: <MdCheckCircleOutline />,
  warning: <MdWarningAmber />,
  info: <MdInfoOutline />,
};

export function NotificationCenter({ items, onClose }) {
  return (
    <div className="notification-viewport">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`notification-card ${item.type}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="notification-icon">
              {ICONS[item.type] || ICONS.info}
            </div>
            <div className="notification-body">{item.message}</div>
            <button
              className="notification-close"
              type="button"
              aria-label="Close notification"
              onClick={() => onClose(item.id)}
            >
              <MdClose />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
