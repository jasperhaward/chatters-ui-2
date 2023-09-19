import { addSeconds } from "date-fns";
import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import styles from "./ToastProvider.module.scss";

import { Toast, ToastContext } from ".";
import { Toast as IToast, ToastParameters } from "./types";

export interface ToastProviderProps {
  children: ComponentChildren;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<IToast[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (toasts.length > 0) {
        const unexpiredToasts: IToast[] = [];

        for (const toast of toasts) {
          if (toast.expiresAt === null || toast.expiresAt > new Date()) {
            unexpiredToasts.push(toast);
          }
        }

        // only call setToasts if any toasts have expired
        if (unexpiredToasts.length !== toasts.length) {
          setToasts(unexpiredToasts);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [toasts]);

  function onDisplayToast(params: ToastParameters) {
    const toast: IToast = {
      ...params,
      expiresAt: params.permanent ? null : addSeconds(new Date(), 4),
    };
    setToasts((prev) => [...prev, toast]);
  }

  function onClearToasts() {
    setToasts([]);
  }

  function onCloseClick(toastIndex: number) {
    const updatedToasts = toasts.filter((toast, index) => {
      return index !== toastIndex;
    });
    setToasts(updatedToasts);
  }

  return (
    <ToastContext.Provider value={[onDisplayToast, onClearToasts]}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            toast={toast}
            onCloseClick={() => onCloseClick(index)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
