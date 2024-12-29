import { ComponentChildren } from "preact";
import styles from "./Modal.module.scss";
import { IconButton } from "@/components";

interface ModalProps {
  title: string;
  children: ComponentChildren;
  onClose: () => void;
}

export default function Modal({ title, children, onClose }: ModalProps) {
  function stopPropagation(event: JSX.TargetedMouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <div className={styles.modalCurtain} onClick={onClose}>
      <div className={styles.modal} onClick={stopPropagation}>
        <div className={styles.title}>
          <h3>{title}</h3>
          <IconButton icon={["fas", "xmark"]} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}
