import { ComponentChildren, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import styles from "./Toast.module.scss";
import { Button } from "./Button";
import { Icon } from "./Icon";

export interface Toast {
  title: string;
  description: string;
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
  const [toast, setToast] = useState<Toast | null>(null);

  function onDisplayToast(toast: Toast) {
    setToast(toast);
    setTimeout(() => setToast(null), 4500);
  }

  function onCloseClick() {
    setToast(null);
  }

  return (
    <ToastContext.Provider value={onDisplayToast}>
      {children}
      {toast && (
        <div className={styles.toast}>
          <div>
            <h3>{toast.title}</h3>
            <div className={styles.description}>{toast.description}</div>
          </div>
          <Button color="ghost" onClick={onCloseClick}>
            <Icon icon={["fas", "times"]} />
          </Button>
        </div>
      )}
    </ToastContext.Provider>
  );
}
