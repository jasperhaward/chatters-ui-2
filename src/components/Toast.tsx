import { ComponentChildren, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import styles from "./Toast.module.scss";
import { Button } from "./Button";
import { Icon } from "./Icon";

export interface Toast {
  permanent?: boolean;
  title: string;
  description: string;
}

export interface ToastWithId extends Toast {
  id: number;
}

export type DisplayToast = (toast: Toast) => void;

const ToastContext = createContext<DisplayToast>(() => {
  throw new Error(`useToast() must be called from within <ToastProvider />.`);
});

export const useToast = () => useContext(ToastContext);

export interface ToastProviderProps {
  children: ComponentChildren;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  function onDisplayToast(toast: Toast) {
    const toastWithId: ToastWithId = {
      id: Math.random(),
      ...toast,
    };

    setToasts([...toasts, toastWithId]);

    if (!toast.permanent) {
      setTimeout(() => {
        removeToast(toastWithId);
      }, 4500);
    }
  }

  function removeToast(toast: ToastWithId) {
    const updatedToasts = toasts.filter((activeToast) => {
      return activeToast.id !== toast.id;
    });
    setToasts(updatedToasts);
  }

  return (
    <ToastContext.Provider value={onDisplayToast}>
      {children}
      {toasts.map((toast, index) => (
        <div key={index} className={styles.toast}>
          <div>
            <h3>{toast.title}</h3>
            <div className={styles.description}>{toast.description}</div>
          </div>
          {!toast.permanent && (
            <Button color="ghost" onClick={() => removeToast(toast)}>
              <Icon icon={["fas", "times"]} />
            </Button>
          )}
        </div>
      ))}
    </ToastContext.Provider>
  );
}
