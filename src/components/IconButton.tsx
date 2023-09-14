import styles from "./IconButton.module.scss";
import { IconTuple, Icon } from ".";

export interface IconButtonProps {
  icon: IconTuple;
  disabled?: boolean;
  onClick: () => void;
}

export function IconButton({ icon, disabled, onClick }: IconButtonProps) {
  return (
    <button className={styles.iconButton} disabled={disabled} onClick={onClick}>
      <Icon icon={icon} />
    </button>
  );
}
