import { addSeconds } from "date-fns";
import { ComponentChildren, createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import styles from "./Toast.module.scss";

import { Button } from "./Button";
import { Icon } from "./Icon";

export interface ToastParameters {
  permanent?: boolean;
  title: string;
  description: string;
}

export interface Toast extends ToastParameters {
  expiresAt: Date | null;
}

export type TToastContext = [
  displayToast: (toast: ToastParameters) => void,
  clearToasts: () => void
];

const ToastContext = createContext<TToastContext | null>(null);

export function useToasts() {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error(
      `useToasts() must be called from within <ToastProvider />.`
    );
  }

  return toastContext;
}

export interface ToastProviderProps {
  children: ComponentChildren;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiredToasts: Toast[] = [];
      const unexpiredToasts: Toast[] = [];

      for (const toast of toasts) {
        if (toast.expiresAt && toast.expiresAt < new Date()) {
          expiredToasts.push(toast);
        } else {
          unexpiredToasts.push(toast);
        }
      }

      if (expiredToasts.length > 0) {
        setToasts(unexpiredToasts);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [toasts]);

  function onDisplayToast(params: ToastParameters) {
    const toast: Toast = {
      ...params,
      expiresAt: params.permanent ? null : addSeconds(new Date(), 4),
    };
    setToasts([...toasts, toast]);
  }

  function onClearToasts() {
    setToasts([]);
  }

  function onCloseClick(index: number) {
    const updatedToasts = toasts.filter(
      (toast, toastIndex) => toastIndex !== index
    );
    setToasts(updatedToasts);
  }

  return (
    <ToastContext.Provider value={[onDisplayToast, onClearToasts]}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast, index) => (
          <div key={index} className={styles.toast}>
            <div>
              <h3>{toast.title}</h3>
              <div className={styles.description}>{toast.description}</div>
            </div>
            {!toast.permanent && (
              <Button color="ghost" onClick={() => onCloseClick(index)}>
                <Icon icon={["fas", "times"]} />
              </Button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
