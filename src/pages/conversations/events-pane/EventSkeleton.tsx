import classNames from "classnames";
import styles from "./EventSkeleton.module.scss";

import { Skeleton } from "@/components";

export interface EventSkeletonProps {
  isAlignRight?: boolean;
  isDisplayAvatar?: boolean;
  width?: string | number;
}

export default function EventSkeleton({
  isAlignRight,
  isDisplayAvatar,
  width,
}: EventSkeletonProps) {
  return (
    <div
      className={classNames(styles.eventSkeleton, {
        [styles.right]: isAlignRight,
      })}
    >
      <div className={styles.avatar}>
        {isDisplayAvatar && <Skeleton icon={["fas", "user"]} />}
      </div>
      <Skeleton className={styles.content} width={width} />
    </div>
  );
}
