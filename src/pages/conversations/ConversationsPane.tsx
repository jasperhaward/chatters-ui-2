import { useMemo } from "preact/hooks";
import styles from "./ConversationsPane.module.scss";

import { UseQuery } from "@/api";
import { Conversation as IConversation } from "@/types";
import { caseInsensitiveIncludes } from "@/utils";

import Conversation from "./Conversation";
import ConversationSkeleton from "./ConversationSkeleton";
import RetryableApiError from "./RetryableApiError";

export interface ConversationsPaneProps {
  search: string;
  conversations: UseQuery<IConversation[]>;
  selectedConversation: IConversation | undefined;
  onConversationClick: (conversation: IConversation) => void;
}

export default function ConversationsPane({
  search,
  conversations,
  selectedConversation,
  onConversationClick,
}: ConversationsPaneProps) {
  const filteredConversations = useMemo(() => {
    if (!conversations.data) {
      return null;
    }

    return conversations.data.filter(filterConversationBySearch);
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
      {conversations.isLoading ? (
        <>
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </>
      ) : conversations.error ? (
        <RetryableApiError onRetryClick={conversations.retry}>
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
