import { format } from "date-fns";
import classNames from "classnames";
import styles from "./MessageCreatedEvent.module.scss";

import { MessageCreatedEvent as IMessageCreatedEvent } from "@/types";
import { Icon } from "@/components";

import { useIsCreatedByUser } from "./useIsCreatedByUser";

interface MessageCreatedEventProps {
  event: IMessageCreatedEvent;
  isDisplayAuthor: boolean;
  isDisplayTimestamp: boolean;
}

export default function MessageCreatedEvent({
  event,
  isDisplayAuthor,
  isDisplayTimestamp,
}: MessageCreatedEventProps) {
  const isEventCreatedByUser = useIsCreatedByUser(event);

  return (
    <div
      className={classNames(styles.messageContainer, {
        [styles.createdByUser]: isEventCreatedByUser,
      })}
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
