import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { NotificationCenter } from "../components/Notifications/NotificationCenter";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [items, setItems] = useState([]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    ({ message, type = "info", duration = 3200 }) => {
      const id = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
      setItems((prev) => [...prev, { id, message, type, duration }]);
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove]
  );

  const value = useMemo(() => ({ notify, remove }), [notify, remove]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <NotificationCenter items={items} onClose={remove} />
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return ctx;
}
