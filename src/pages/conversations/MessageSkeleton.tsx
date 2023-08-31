import styles from "./MessageSkeleton.module.scss";

import { Skeleton } from "@/components";

export interface MessageSkeletonProps {
  isAlignRight?: boolean;
  isDisplayAvatar?: boolean;
  width?: string | number;
}

export default function MessageSkeleton({
  isAlignRight,
  isDisplayAvatar,
  width,
}: MessageSkeletonProps) {
  return (
    <div
      className={`${styles.messageSkeleton} ${
        isAlignRight ? styles.right : ""
      }`}
    >
      <div className={styles.avatar}>
        {isDisplayAvatar && <Skeleton icon={["fas", "user"]} />}
      </div>
      <Skeleton className={styles.content} width={width} />
    </div>
  );
}
