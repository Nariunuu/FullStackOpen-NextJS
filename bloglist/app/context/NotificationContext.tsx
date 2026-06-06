"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NotificationType = "success" | "error" | "info";

export type Notification = {
  message: string;
  type: NotificationType;
};

type NotificationContextValue = {
  notification: Notification | null;
  notify: (
    message: string,
    type?: NotificationType,
    durationMs?: number,
  ) => void;
  clear: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

const DEFAULT_DURATION_MS = 4000;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setNotification(null);
  }, []);

  const notify = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      durationMs = DEFAULT_DURATION_MS,
    ) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setNotification({ message, type });
      timerRef.current = setTimeout(() => {
        setNotification(null);
        timerRef.current = null;
      }, durationMs);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, notify, clear }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return ctx;
}
