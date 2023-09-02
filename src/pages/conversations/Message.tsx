import { format } from "date-fns";
import styles from "./Message.module.scss";

import { Message as IMessage } from "@/types";
import { Icon } from "@/components";

export interface MessageProps {
  message: IMessage;
  isCreatedByUser: boolean;
  isDisplayAuthor: boolean;
  isDisplayTimestamp: boolean;
}

export default function Message({
  message,
  isCreatedByUser,
  isDisplayAuthor,
  isDisplayTimestamp,
}: MessageProps) {
  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);

    return format(date, "HH:mm");
  }

  return (
    <div
      className={`${styles.messageContainer} ${
        isCreatedByUser ? styles.createdByUser : ""
      }`}
    >
      {isDisplayAuthor && (
        <div className={styles.author}>{message.createdBy.username}</div>
      )}
      <div className={styles.message}>
        <div className={styles.avatar}>
          {isDisplayAuthor && <Icon icon={["fas", "user"]} />}
        </div>
        <div className={styles.content}>{message.content}</div>
      </div>
      {isDisplayTimestamp && (
        <time className={styles.timestamp}>
          {formatTimestamp(message.createdAt)}
        </time>
      )}
    </div>
  );
}
