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

  const { latestMessage } = conversation;
  const isGroupConversation = conversation.recipients.length > 1;

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
      <div className={styles.detailsContainer}>
        <div className={styles.upperDetails}>
          <HighlightedText className={styles.title} query={search}>
            {buildConversationHeader(conversation)}
          </HighlightedText>
          <Timestamp className={styles.timestamp} short>
            {latestMessage?.createdAt || conversation.createdAt}
          </Timestamp>
        </div>
        <div className={styles.lowerDetails}>
          <span>
            {latestMessage
              ? latestMessage.createdBy.id === session.user.id
                ? "You"
                : isGroupConversation
                ? latestMessage.createdBy.username
                : ""
              : conversation.createdBy.username}
            :
          </span>
          {latestMessage?.content || "Conversation created"}
        </div>
      </div>
    </button>
  );
}
