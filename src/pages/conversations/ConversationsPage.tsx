import { useEffect, useMemo } from "preact/hooks";
import { useLocation } from "wouter";
import styles from "./ConversationsPage.module.scss";

import { paths } from "@/App";
import { useConversations, useMessages, useLogout } from "@/api";
import { Conversation as IConversation } from "@/types";
import { useSession, useInputs } from "@/hooks";
import { Spinner, FixedElement, Button, Card } from "@/components";

import { buildConversationTitle } from "./utils";
import ConversationsPane from "./ConversationsPane";
import SearchBox from "./SearchBox";
import MessageBox from "./MessageBox";
import MessagesPane from "./MessagesPane";

const conversationInputs = {
  search: "",
  message: "",
};

export interface ChatProps {
  params: {
    id?: string;
  };
}

export default function ConversationsPage({ params }: ChatProps) {
  const [session, setSession] = useSession();
  const [location, setLocation] = useLocation();

  const [inputs, onInput, setInputs] = useInputs(conversationInputs);
  const logout = useLogout();
  const conversations = useConversations();

  const selectedConversation = useMemo(() => {
    if (!conversations.data || !params.id) {
      return;
    }

    return conversations.data.find((conversation) => {
      return conversation.id === params.id;
    });
  }, [conversations.data, params.id]);

  const messages = useMessages(selectedConversation);

  useEffect(() => {
    if (
      conversations.data &&
      conversations.data.length > 0 &&
      !selectedConversation
    ) {
      setLocation(`${paths.conversations}/${conversations.data[0]!.id}`);
    }
  }, [conversations.data, selectedConversation]);

  async function onLogoutClick() {
    const result = await logout.mutate();

    if (!result.error) {
      setSession(null);
    }
  }

  function onSearchClearClick() {
    setInputs({ search: "" });
  }

  function onConversationClick(conversation: IConversation) {
    setLocation(`${paths.conversations}/${conversation.id}`);
  }

  function onMessageSubmit() {
    setInputs({ message: "" });
  }

  return (
    <div className={styles.conversations}>
      <Card flex>
        <span className={styles.conversationsPanel}>
          <h2>Conversations</h2>
          <SearchBox
            name="search"
            value={inputs.search}
            disabled={conversations.isLoading || !!conversations.error}
            onInput={onInput}
            onClear={onSearchClearClick}
          />
          <ConversationsPane
            isLoading={conversations.isLoading}
            search={inputs.search}
            error={conversations.error}
            conversations={conversations.data}
            selectedConversation={selectedConversation}
            onConversationClick={onConversationClick}
            onRetryClick={conversations.retry}
          />
          <Button
            color="contrast"
            disabled={conversations.isLoading || !!conversations.error}
          >
            Create conversation
          </Button>
        </span>
        <span className={styles.messagesPanel}>
          <h2>
            {selectedConversation
              ? buildConversationTitle(selectedConversation)
              : "Messages"}
          </h2>
          <MessagesPane
            isLoading={messages.isLoading}
            error={messages.error}
            messages={messages.data}
            onRetryClick={messages.retry}
          />
          <MessageBox
            name="message"
            value={inputs.message}
            disabled={conversations.isLoading || !!conversations.error}
            onInput={onInput}
            onSubmit={onMessageSubmit}
          />
        </span>
      </Card>
      <FixedElement position="topRight">
        <Button
          color="ghost"
          disabled={logout.isLoading}
          onClick={onLogoutClick}
        >
          {logout.isLoading && <Spinner color="foreground" />}
          Logout
        </Button>
      </FixedElement>
    </div>
  );
}
