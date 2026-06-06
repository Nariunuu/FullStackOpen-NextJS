"use client";

import { useNotification } from "../context/NotificationContext";

const typeStyles: Record<string, string> = {
  success:
    "bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800",
  error:
    "bg-red-50 text-red-900 border-red-300 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800",
  info: "bg-blue-50 text-blue-900 border-blue-300 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800",
};

export default function Notification() {
  const { notification, clear } = useNotification();

  if (!notification) return null;

  const colorClasses = typeStyles[notification.type] ?? typeStyles.info;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <div
        role="status"
        className={`pointer-events-auto flex items-center gap-3 rounded-md border px-4 py-2 text-sm shadow-md ${colorClasses}`}
      >
        <span>{notification.message}</span>
        <button
          type="button"
          onClick={clear}
          aria-label="Dismiss notification"
          className="rounded text-current/70 hover:text-current"
        >
          ×
        </button>
      </div>
    </div>
  );
}
