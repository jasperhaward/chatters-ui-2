import { useMemo } from "preact/hooks";
import styles from "./ConversationsPane.module.scss";

import { UseQuery } from "@/api";
import { Conversation as IConversation } from "@/types";
import { ErrorMessage } from "@/components";

import Conversation from "./Conversation";
import { buildConversationHeader } from "./utils";

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

    return conversations.data.filter((conversation) => {
      return buildConversationHeader(conversation)
        .toUpperCase()
        .includes(search.toUpperCase());
    });
  }, [conversations, search]);

  return conversations.isLoading ? (
    <div>Skeleton</div>
  ) : conversations.error ? (
    <ErrorMessage>{conversations.error.message}</ErrorMessage>
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
  );
}
