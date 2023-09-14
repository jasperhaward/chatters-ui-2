import styles from "./Toast.module.scss";
import { IconButton } from "@/components";
import { Toast as IToast } from "./types";

export interface ToastProps {
  toast: IToast;
  onCloseClick: () => void;
}

export function Toast({ toast, onCloseClick }: ToastProps) {
  return (
    <div className={styles.toast}>
      <div>
        <h3>{toast.title}</h3>
        <div className={styles.description}>{toast.description}</div>
      </div>
      {!toast.permanent && (
        <IconButton icon={["fas", "times"]} onClick={onCloseClick} />
      )}
    </div>
  );
}
