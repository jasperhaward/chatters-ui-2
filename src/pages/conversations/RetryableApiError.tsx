import styles from "./RetryableApiError.module.scss";

import { Button } from "@/components";

export interface RetryableApiErrorProps {
  children: string;
  onRetryClick: () => void;
}

export default function RetryableApiError({
  children,
  onRetryClick,
}: RetryableApiErrorProps) {
  return (
    <div className={styles.retryableError}>
      <p>{children}</p>
      <Button color="foreground" onClick={onRetryClick}>
        Retry
      </Button>
    </div>
  );
}
