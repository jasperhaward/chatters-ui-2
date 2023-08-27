import { useMemo } from "preact/hooks";
import styles from "./ConversationsPane.module.scss";

import { Conversation as IConversation } from "@/types";
import { Button } from "@/components";
import { caseInsensitiveIncludes } from "@/utils";

import Conversation from "./Conversation";
import ConversationSkeleton from "./ConversationSkeleton";

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

    return conversations.filter(filterConversationBySearch);
  }, [conversations, search]);

  /**
   * Should return true if a conversation's title or any
   * recipient's username includes the search string.
   */
  function filterConversationBySearch(conversation: IConversation) {
    if (
      conversation.title &&
      caseInsensitiveIncludes(conversation.title, search)
    ) {
      return true;
    }

    return conversation.recipients.some((recipient) => {
      return caseInsensitiveIncludes(recipient.username, search);
    });
  }

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
        filteredConversations.map((conversation) => (
          <Conversation
            key={conversation.id}
            isSelected={conversation === selectedConversation}
            search={search}
            conversation={conversation}
            onClick={onConversationClick}
          />
        ))
      ) : (
        <div className={styles.centerChildren}>
          <div className={styles.noConversations}>No conversations found.</div>
        </div>
      )}
    </div>
  );
}
