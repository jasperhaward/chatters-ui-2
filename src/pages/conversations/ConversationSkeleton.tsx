import styles from "./ConversationSkeleton.module.scss";

import { Skeleton } from "@/components";

export default function ConversationSkeleton() {
  return (
    <div className={styles.conversationSkeleton}>
      <Skeleton className={styles.avatar} icon={["fas", "user"]} />
      <div className={styles.details}>
        <Skeleton />
        <Skeleton className={styles.message} />
      </div>
    </div>
  );
}
