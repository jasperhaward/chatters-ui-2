import { ComponentChildren } from "preact";
import styles from "./Modal.module.scss";
import { IconButton } from ".";

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ComponentChildren;
  onClose: () => void;
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  function stopPropagation(event: JSX.TargetedMouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <div
      className={`${styles.modalCurtain} ${isOpen ? styles.open : ""}`}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={stopPropagation}>
        <div className={styles.title}>
          <h3>{title}</h3>
          <IconButton icon={["fas", "times"]} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}
