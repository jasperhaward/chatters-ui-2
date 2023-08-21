import { useEffect, useMemo } from "preact/hooks";
import { useLocation } from "wouter";
import styles from "./ConversationsPage.module.scss";

import { paths } from "../../App";
import { useConversations, useLogout } from "../../api";
import {
  Spinner,
  FixedElement,
  Button,
  Card,
  ErrorMessage,
} from "../../components";
import { useSession, useInputs } from "../../hooks";
import { Conversation as IConversation } from "../../types";

import Conversation from "./Conversation";
import ConversationsPane from "./ConversationsPane";
import SearchBox from "./SearchBox";

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

  useEffect(() => {
    if (conversations.data && !selectedConversation) {
      setLocation(`${paths.conversations}/${conversations.data[0].id}`);
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

  return (
    <div className={styles.conversations}>
      <Card className={styles.card}>
        <span className={styles.conversationsPanel}>
          <h3>Conversations</h3>
          <SearchBox
            name="search"
            value={inputs.search}
            disabled={conversations.isLoading}
            onInput={onInput}
            onClear={onSearchClearClick}
          />
          <div className={styles.conversationsContainer}>
            <ConversationsPane
              search={inputs.search}
              conversations={conversations}
              selectedConversation={selectedConversation}
              onConversationClick={onConversationClick}
            />
          </div>
          <Button>Create conversation</Button>
        </span>
        <span className={styles.messagesPanel}>Messages</span>
      </Card>
      <FixedElement position="topRight">
        <Button
          color="ghost"
          disabled={logout.isLoading}
          onClick={onLogoutClick}
        >
          {logout.isLoading && <Spinner color="white" />}
          Logout
        </Button>
      </FixedElement>
    </div>
  );
}
