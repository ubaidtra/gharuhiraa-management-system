"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

const ToastContext = createContext<{ showToast: (type: "success" | "error", message: string) => void } | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cnt, setCnt] = useState(0);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    const id = `toast-${cnt}-${Date.now()}`;
    setCnt((p) => p + 1);
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5000);
  }, [cnt]);

  const remove = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((t) =>
          t.type === "success" ? (
            <SuccessMessage key={t.id} message={t.message} onDismiss={() => remove(t.id)} className="shadow-lg" />
          ) : (
            <ErrorMessage key={t.id} message={t.message} onDismiss={() => remove(t.id)} className="shadow-lg" />
          )
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
