import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./Conversation.module.scss";

import {
  ConversationEvent,
  ConversationEventType,
  Conversation as IConversation,
} from "@/types";
import { useScrollIntoView } from "@/hooks";
import { Icon, HighlightedText } from "@/components";
import { useSession } from "@/features/auth";
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

  const isGroupConversation = conversation.recipients.length > 2;
  const isLatestEventCreatedByUser =
    conversation.latestEvent.createdBy.id === session.user.id;

  function formatLatestEventCreatedAt(event: ConversationEvent) {
    const date = new Date(event.createdAt);

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

  function formatLatestEventContent(event: ConversationEvent) {
    switch (event.type) {
      case ConversationEventType.TitleUpdated:
        return `Changed the title to '${event.title}'`;
      case ConversationEventType.MessageCreated:
        return event.message;
      case ConversationEventType.RecipientCreated:
        return `Added ${event.recipient.username}`;
      case ConversationEventType.RecipientRemoved:
        return `Removed ${event.recipient.username}`;
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
          {buildConversationTitle(conversation, session.user.id)}
        </HighlightedText>
        <div className={styles.event}>
          {(isLatestEventCreatedByUser || isGroupConversation) && (
            <span>
              {isLatestEventCreatedByUser
                ? "You:"
                : `${conversation.latestEvent.createdBy.username}:`}
            </span>
          )}
          {formatLatestEventContent(conversation.latestEvent)}
        </div>
      </div>
      <time className={styles.timestamp}>
        {formatLatestEventCreatedAt(conversation.latestEvent)}
      </time>
    </button>
  );
}
