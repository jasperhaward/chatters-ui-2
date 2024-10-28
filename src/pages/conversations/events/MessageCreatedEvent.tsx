import { format } from "date-fns";
import styles from "./MessageCreatedEvent.module.scss";

import { MessageCreatedEvent as IMessageCreatedEventa } from "@/types";
import { Icon } from "@/components";

export interface MessageProps {
  event: IMessageCreatedEventa;
  isCreatedByUser: boolean;
  isDisplayAuthor: boolean;
  isDisplayTimestamp: boolean;
}

export default function MessageCreatedEvent({
  event,
  isCreatedByUser,
  isDisplayAuthor,
  isDisplayTimestamp,
}: MessageProps) {
  return (
    <div
      className={`${styles.messageContainer} ${
        isCreatedByUser ? styles.createdByUser : ""
      }`}
    >
      {isDisplayAuthor && (
        <div className={styles.author}>{event.createdBy.username}</div>
      )}
      <div className={styles.message}>
        <div className={styles.avatar}>
          {isDisplayAuthor && <Icon icon={["fas", "user"]} />}
        </div>
        <div className={styles.content}>{event.message}</div>
      </div>
      {isDisplayTimestamp && (
        <time className={styles.timestamp}>
          {format(new Date(event.createdAt), "HH:mm")}
        </time>
      )}
    </div>
  );
}
