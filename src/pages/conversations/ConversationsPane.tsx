import { useMemo } from "preact/hooks";
import styles from "./ConversationsPane.module.scss";

import { Conversation as IConversation } from "@/types";
import { caseInsensitiveIncludes } from "@/utils";

import Conversation from "./Conversation";
import ConversationSkeleton from "./ConversationSkeleton";
import RetryableApiError from "./RetryableApiError";

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
        <RetryableApiError onRetryClick={onRetryClick}>
          Failed to load conversations, please try again.
        </RetryableApiError>
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
        <div className={styles.noConversations}>
          <p>No conversations found</p>
        </div>
      )}
    </div>
  );
}
