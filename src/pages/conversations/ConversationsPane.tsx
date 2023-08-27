import { useMemo } from "preact/hooks";
import styles from "./ConversationsPane.module.scss";

import { Conversation as IConversation } from "@/types";
import { Button } from "@/components";

import Conversation from "./Conversation";
import ConversationSkeleton from "./ConversationSkeleton";
import { buildConversationHeader } from "./utils";

export interface ConversationsPaneProps {
  isLoading: boolean;
  search: string;
  error: Error | null;
  conversations: IConversation[] | null;
  selectedConversation: IConversation | undefined;
  onConversationClick: (conversation: IConversation) => void;
  onRetryClick: () => void;
}

export default function ConversationsPane({
  isLoading,
  search,
  error,
  conversations,
  selectedConversation,
  onConversationClick,
  onRetryClick,
}: ConversationsPaneProps) {
  const filteredConversations = useMemo(() => {
    if (!conversations) {
      return null;
    }

    return conversations.filter((conversation) => {
      return buildConversationHeader(conversation)
        .toUpperCase()
        .includes(search.toUpperCase());
    });
  }, [conversations, search]);

  return (
    <div className={styles.conversationsPane}>
      {isLoading ? (
        <>
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </>
      ) : error ? (
        <div className={styles.centerChildren}>
          <div className={styles.errorMessage}>
            Failed to load conversations, <br /> please try again.
          </div>
          <Button color="contrast" onClick={onRetryClick}>
            Retry
          </Button>
        </div>
      ) : filteredConversations && filteredConversations.length > 0 ? (
        <>
          {filteredConversations.map((conversation) => (
            <Conversation
              key={conversation.id}
              isSelected={conversation === selectedConversation}
              search={search}
              conversation={conversation}
              onClick={onConversationClick}
            />
          ))}
        </>
      ) : (
        <div className={styles.centerChildren}>
          <div className={styles.noConversations}>No conversations found.</div>
        </div>
      )}
    </div>
  );
}
