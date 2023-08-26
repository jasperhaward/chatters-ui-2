import styles from "./Skeleton.module.scss";
import { Icon, IconTuple } from ".";

export interface SkeletonProps {
  className?: string;
  icon?: IconTuple;
}

export function Skeleton({ className = "", icon }: SkeletonProps) {
  if (icon) {
    return (
      <Icon
        className={`${styles.skeleton} ${styles.icon} ${className}`}
        icon={icon}
      />
    );
  }

  return <div className={`${styles.skeleton} ${styles.text} ${className}`} />;
}
