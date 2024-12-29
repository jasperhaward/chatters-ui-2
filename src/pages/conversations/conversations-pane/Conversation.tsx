import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import classNames from "classnames";
import styles from "./Conversation.module.scss";

import {
  ConversationEvent,
  ConversationEventType,
  Conversation as IConversation,
} from "@/types";
import { useScrollIntoView } from "@/hooks";
import { HighlightedText, Icon } from "@/components";

import { isConversationGroupConversation } from "../utils";
import { useIsCreatedByUser } from "../useIsCreatedByUser";
import { useConversationTitle } from "../useConversationTitle";

interface ConversationProps {
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
  const ref = useScrollIntoView<HTMLButtonElement>([], {
    enabled: isSelected,
  });
  const title = useConversationTitle(conversation);
  const isLatestEventCreatedByUser = useIsCreatedByUser(
    conversation.latestEvent
  );
  const isGroupConversation = isConversationGroupConversation(conversation);

  const author = isLatestEventCreatedByUser
    ? "You"
    : conversation.latestEvent.createdBy.username;

  return (
    <button
      ref={ref}
      className={classNames(styles.conversation, {
        [styles.selected]: isSelected,
      })}
      onClick={() => onClick(conversation)}
    >
      <Icon
        className={styles.avatar}
        icon={["fas", isGroupConversation ? "users" : "user"]}
      />
      <div className={styles.details}>
        <HighlightedText className={styles.title} query={search}>
          {title!}
        </HighlightedText>
        <div className={styles.event}>
          {(isLatestEventCreatedByUser || isGroupConversation) && (
            <span>{author}:</span>
          )}
          {formatLatestEventContent(
            conversation.latestEvent,
            isGroupConversation
          )}
        </div>
      </div>
      <time className={styles.timestamp}>
        {formatLatestEventCreatedAt(conversation.latestEvent)}
      </time>
    </button>
  );
}

function formatLatestEventContent(
  event: ConversationEvent,
  isGroupConversation: boolean
) {
  switch (event.type) {
    case ConversationEventType.TitleUpdated:
      return event.title === null
        ? "Removed the title"
        : `Changed the title to '${event.title}'`;
    case ConversationEventType.MessageCreated:
      return event.message;
    case ConversationEventType.RecipientCreated:
      return `Added ${event.recipient.username}`;
    case ConversationEventType.RecipientRemoved:
      if (event.recipient.id === event.createdBy.id) {
        if (isGroupConversation) {
          return `Left the conversation`;
        } else {
          return `${event.recipient.username} left the conversation`;
        }
      }

      return `Removed ${event.recipient.username}`;
  }
}

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
