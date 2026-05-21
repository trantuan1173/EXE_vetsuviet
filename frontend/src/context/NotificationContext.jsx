import { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const success = useCallback(
    (msg) => addNotification(msg, 'success'),
    [addNotification]
  );

  const error = useCallback(
    (msg) => addNotification(msg, 'error'),
    [addNotification]
  );

  const info = useCallback(
    (msg) => addNotification(msg, 'info'),
    [addNotification]
  );

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, success, error, info, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
