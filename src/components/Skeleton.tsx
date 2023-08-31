import styles from "./Skeleton.module.scss";
import { Icon, IconTuple } from ".";

export interface SkeletonProps {
  className?: string;
  icon?: IconTuple;
  width?: number | string;
}

export function Skeleton({ className = "", width, icon }: SkeletonProps) {
  if (icon) {
    return (
      <Icon
        className={`${styles.skeleton} ${styles.icon} ${className}`}
        icon={icon}
      />
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${styles.text} ${className}`}
      style={{ width }}
    />
  );
}
