import styles from "./Conversation.module.scss";

import { Conversation as IConversation } from "@/types";
import { useScrollIntoView, useSession } from "@/hooks";
import { Icon, Timestamp, HighlightedText } from "@/components";
import { buildConversationHeader } from "./utils";

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
          {buildConversationHeader(conversation)}
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
      <Timestamp className={styles.timestamp} short>
        {conversation.latestMessage?.createdAt || conversation.createdAt}
      </Timestamp>
    </button>
  );
}
