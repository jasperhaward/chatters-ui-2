import styles from "./IconButton.module.scss";
import { IconTuple, Icon } from ".";

export interface IconButtonProps {
  className?: string;
  icon: IconTuple;
  disabled?: boolean;
  onClick?: () => void;
}

export function IconButton({
  className = "",
  icon,
  disabled,
  onClick,
}: IconButtonProps) {
  return (
    <button
      className={`${styles.iconButton} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon icon={icon} />
    </button>
  );
}
