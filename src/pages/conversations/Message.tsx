import { format } from "date-fns";
import styles from "./Message.module.scss";

import { Message as IMessage } from "@/types";
import { Icon } from "@/components";

export interface MessageProps {
  message: IMessage;
  isCreatedByUser: boolean;
  isDisplayAvatar: boolean;
  isDisplayTimestamp: boolean;
}

export default function Message({
  message,
  isCreatedByUser,
  isDisplayAvatar,
  isDisplayTimestamp,
}: MessageProps) {
  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);

    return format(date, "HH:mm");
  }

  return (
    <div
      className={`${styles.message} ${
        isCreatedByUser ? styles.createdByUser : ""
      }`}
    >
      <div className={styles.avatar}>
        {isDisplayAvatar && <Icon icon={["fas", "user"]} />}
      </div>
      <div>
        <div className={styles.content}>{message.content}</div>
        {isDisplayTimestamp && (
          <time className={styles.timestamp}>
            {formatTimestamp(message.createdAt)}
          </time>
        )}
      </div>
    </div>
  );
}
