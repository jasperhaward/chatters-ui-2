import { useMemo } from "preact/hooks";
import styles from "./ConversationsPane.module.scss";

import { Conversation as IConversation } from "@/types";
import { ErrorMessage } from "@/components";

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
}

export default function ConversationsPane({
  isLoading,
  search,
  error,
  conversations,
  selectedConversation,
  onConversationClick,
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
    <div
      className={`${styles.conversationsPane} ${
        isLoading ? "" : styles.overflow
      }`}
    >
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
        <ErrorMessage>{error.message}</ErrorMessage>
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
        <div className={styles.noConversations}>No conversations found.</div>
      )}
    </div>
  );
}
