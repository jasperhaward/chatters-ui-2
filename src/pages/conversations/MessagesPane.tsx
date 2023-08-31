import { useRef, useEffect, useMemo } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import {
  isSameDay,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  differenceInMinutes,
  format,
} from "date-fns";
import styles from "./MessagesPane.module.scss";

import { Message as IMessage } from "@/types";
import { useSession } from "@/hooks";
import { Button, CenterChildren } from "@/components";
import Message from "./Message";
import MessageSkeleton from "./MessageSkeleton";

export interface MessagesPaneProps {
  isLoading: boolean;
  error: Error | null;
  messages: IMessage[] | null;
  onRetryClick: () => void;
}

export default function MessagesPane({
  isLoading,
  error,
  messages,
  onRetryClick,
}: MessagesPaneProps) {
  const [{ user }] = useSession();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const layout = useMemo(() => {
    if (!messages) {
      return null;
    }

    return messages.slice().reverse().map(buildLayout);
  }, [messages]);

  function buildLayout(message: IMessage, index: number, messages: IMessage[]) {
    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1];

    const isCreatedByUser = message.createdBy.id === user.id;

    return {
      message,
      isCreatedByUser,
      isDisplayDatestamp: isDisplayDatestamp(prevMessage, message),
      isDisplayTimestamp: isDisplayTimestamp(message, nextMessage),
      isDisplayAvatar: isCreatedByUser
        ? false
        : isDisplayAvatar(prevMessage, message),
    };
  }

  /**
   * Determines whether a datestamp between messages should be shown.
   * @param prevMessage
   * @param message
   * @returns true if:
   *  - there is no `prevMessage` or;
   *  - `message` & `prevMessage` were sent on different days
   */
  function isDisplayDatestamp(
    prevMessage: IMessage | undefined,
    message: IMessage
  ) {
    return (
      !prevMessage ||
      !isSameDay(new Date(message.createdAt), new Date(prevMessage.createdAt))
    );
  }

  /**
   * Determines whether a message's (that wasn't created by the current user) avatar should be displayed.
   * @param prevMessage
   * @param message
   * @returns true if:
   *  - there is no `prevMessage` or;
   *  - `message` & `prevMessage` were created by different users
   */
  function isDisplayAvatar(
    prevMessage: IMessage | undefined,
    message: IMessage
  ) {
    return !prevMessage || message.createdBy.id !== prevMessage.createdBy.id;
  }

  /**
   * Determines whether a message's timestamp should be displayed.
   * @param message
   * @param nextMessage
   * @returns true if:
   *  - there is no `nextMessage` or;
   *  - `message` and `nextMessage` were created by different users or;
   *  - `message` and `nextMessage` were sent more than 5 minutes apart
   */
  function isDisplayTimestamp(
    message: IMessage,
    nextMessage: IMessage | undefined
  ) {
    return (
      !nextMessage ||
      message.createdBy.id !== nextMessage.createdBy.id ||
      Math.abs(
        differenceInMinutes(
          new Date(message.createdAt),
          new Date(nextMessage.createdAt)
        )
      ) > 5
    );
  }

  function formatDatestamp(timestamp: string) {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isThisWeek(date)) {
      return format(date, "EEEE");
    } else if (isThisYear(date)) {
      return format(date, "d LLLL");
    } else {
      return format(date, "d LLLL yyyy");
    }
  }

  return (
    <div className={styles.messagesPane}>
      {isLoading ? (
        <>
          <MessageSkeleton isAlignRight width="40%" />
          <MessageSkeleton isAlignRight width="35%" />
          <MessageSkeleton isDisplayAvatar width="40%" />
          <MessageSkeleton isAlignRight width="45%" />
          <MessageSkeleton isDisplayAvatar width="35%" />
          <MessageSkeleton width="45%" />
          <MessageSkeleton isAlignRight width="35%" />
          <MessageSkeleton isDisplayAvatar width="40%" />
          <MessageSkeleton width="35%" />
        </>
      ) : error ? (
        <CenterChildren>
          <div className={styles.errorMessage}>
            Failed to load messages, please try again.
          </div>
          <Button color="contrast" onClick={onRetryClick}>
            Retry
          </Button>
        </CenterChildren>
      ) : (
        layout!.map(({ message, ...layout }) => (
          <Fragment key={message.id}>
            {layout.isDisplayDatestamp && (
              <time className={styles.datestamp}>
                {formatDatestamp(message.createdAt)}
              </time>
            )}
            <Message
              message={message}
              isCreatedByUser={layout.isCreatedByUser}
              isDisplayAvatar={layout.isDisplayAvatar}
              isDisplayTimestamp={layout.isDisplayTimestamp}
            />
          </Fragment>
        ))
      )}
      <div ref={ref} />
    </div>
  );
}
