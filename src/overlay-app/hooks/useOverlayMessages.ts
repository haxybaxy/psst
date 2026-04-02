import { useEffect, useState, useCallback } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { Message } from "../../lib/types";
import { EVENTS } from "../../lib/events";

const TOAST_DURATION = 4000;

interface ToastMessage extends Message {
  expiresAt: number;
}

export function useOverlayMessages() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unlisten = listen<Message>(EVENTS.SHOW_MESSAGE, (event) => {
      const message = event.payload;
      const toast: ToastMessage = {
        ...message,
        expiresAt: Date.now() + TOAST_DURATION,
      };
      setToasts((prev) => [...prev, toast]);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // Remove expired toasts
  useEffect(() => {
    if (toasts.length === 0) return;

    const nextExpiry = Math.min(...toasts.map((t) => t.expiresAt));
    const delay = nextExpiry - Date.now();

    const timer = setTimeout(() => {
      const now = Date.now();
      setToasts((prev) => {
        const remaining = prev.filter((t) => t.expiresAt > now);
        if (remaining.length === 0) {
          invoke("hide_overlay");
        }
        return remaining;
      });
    }, Math.max(delay, 0));

    return () => clearTimeout(timer);
  }, [toasts]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (remaining.length === 0) {
        invoke("hide_overlay");
      }
      return remaining;
    });
  }, []);

  return { toasts, dismissToast };
}
