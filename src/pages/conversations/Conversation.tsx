import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./Conversation.module.scss";

import { Conversation as IConversation } from "@/types";
import { useScrollIntoView, useSession } from "@/hooks";
import { Icon, HighlightedText } from "@/components";
import { buildConversationTitle } from "./utils";

export interface ConversationProps {
  isSelected: boolean;
  search: string;
  conversation: IConversation;
  onClick: (conversation: IConversation) => void;
}

export default function Conversation({
  isSelected,
  search,
  conversation,
  onClick,
}: ConversationProps) {
  const ref = useScrollIntoView<HTMLButtonElement>(isSelected);
  const [session] = useSession();

  const isGroupConversation = conversation.recipients.length > 1;
  const isLatestMessageCreatedByUser =
    conversation.latestMessage?.createdBy.id === session.user.id;

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isThisWeek(date)) {
      return format(date, "E");
    } else if (isThisYear(date)) {
      return format(date, "d LLL");
    } else {
      return format(date, "LLL yyyy");
    }
  }

  return (
    <button
      ref={ref}
      className={`${styles.conversation} ${isSelected ? styles.selected : ""}`}
      onClick={() => onClick(conversation)}
    >
      <Icon
        className={styles.avatar}
        icon={["fas", isGroupConversation ? "users" : "user"]}
      />
      <div className={styles.details}>
        <HighlightedText className={styles.title} query={search}>
          {buildConversationTitle(conversation)}
        </HighlightedText>
        {conversation.latestMessage ? (
          <div className={styles.message}>
            {(isLatestMessageCreatedByUser || isGroupConversation) && (
              <span>
                {isLatestMessageCreatedByUser
                  ? "You:"
                  : `${conversation.latestMessage.createdBy.username}:`}
              </span>
            )}
            {conversation.latestMessage.content}
          </div>
        ) : (
          <div className={styles.created}>Conversation created</div>
        )}
      </div>
      <time className={styles.timestamp}>
        {formatTimestamp(
          conversation.latestMessage?.createdAt || conversation.createdAt
        )}
      </time>
    </button>
  );
}
