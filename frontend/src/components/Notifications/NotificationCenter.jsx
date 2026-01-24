import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import {
  MdErrorOutline,
  MdCheckCircleOutline,
  MdInfoOutline,
  MdWarningAmber,
  MdClose,
} from "react-icons/md";

import { generateRandomAvatar } from "@api/avatar.random";
import "./NotificationCenter.scss";

const ICONS = {
  error: <MdErrorOutline />,
  success: <MdCheckCircleOutline />,
  warning: <MdWarningAmber />,
  info: <MdInfoOutline />,
};

export function NotificationCenter({ items, onClose }) {
  const [successAvatars, setSuccessAvatars] = useState({});
  const successAvatarsRef = useRef(successAvatars);

  const setAvatars = (updater) => {
    setSuccessAvatars((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      successAvatarsRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    const successItems = items.filter((item) => item.type === "success");
    const successIds = new Set(successItems.map((item) => item.id));
    const currentAvatars = successAvatarsRef.current;

    successItems.forEach(async (item) => {
      if (currentAvatars[item.id]) return;
      try {
        const url = await generateRandomAvatar("bottts");
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        setAvatars((prev) => {
          if (prev[item.id]) {
            URL.revokeObjectURL(url);
            return prev;
          }
          return { ...prev, [item.id]: url };
        });
      } catch {
        return;
      }
    });

    Object.entries(currentAvatars).forEach(([id, url]) => {
      if (!successIds.has(id)) {
        URL.revokeObjectURL(url);
        setAvatars((prev) => {
          if (!prev[id]) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [items]);

  useEffect(
    () => () => {
      Object.values(successAvatarsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    },
    []
  );

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
            <div
              className={`notification-icon${
                item.type === "success" && successAvatars[item.id]
                  ? " has-avatar"
                  : ""
              }`}
            >
              {item.type === "success" && successAvatars[item.id] ? (
                <img
                  className="notification-avatar"
                  src={successAvatars[item.id]}
                  alt="Success bottts avatar"
                />
              ) : (
                ICONS[item.type] || ICONS.info
              )}
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
