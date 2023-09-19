import { useEffect, useMemo, useState } from "preact/hooks";
import { useLocation } from "wouter";
import styles from "./ConversationsPage.module.scss";

import { paths } from "@/App";
import {
  CreateMessageParams,
  useConversations,
  useMessages,
  useLogout,
  useCreateMessage,
  ServerEvent,
  useServerEvents,
  useContacts,
} from "@/api";
import { Conversation, Message } from "@/types";
import { useInputs } from "@/hooks";
import { FixedElement, Button, Card } from "@/components";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";

import { buildConversationTitle } from "./utils";
import ConversationsPane from "./ConversationsPane";
import SearchBox from "./SearchBox";
import MessageBox from "./MessageBox";
import MessagesPane from "./MessagesPane";
import CreateConversationModal from "./CreateConversationModal";

export interface ChatProps {
  params: {
    conversationId?: string;
  };
}

export default function ConversationsPage({ params }: ChatProps) {
  const [session, setSession] = useSession();
  const [location, setLocation] = useLocation();
  const [toast, clearToasts] = useToasts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, onInput, setInputs] = useInputs({
    search: "",
    message: "",
  });

  const logout = useLogout();
  const conversations = useConversations();
  const contacts = useContacts();
  const createMessage = useCreateMessage();
  const disconnectServerEvents = useServerEvents(onServerEvent);

  const selectedConversation = useMemo(() => {
    if (!conversations.data || !params.conversationId) {
      return;
    }

    return conversations.data.find((conversation) => {
      return conversation.id === params.conversationId;
    });
  }, [conversations.data, params.conversationId]);

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

  useEffect(() => {
    // clear toasts & disconnect from server events on unmount
    return () => {
      disconnectServerEvents();
      clearToasts();
    };
  }, []);

  function onServerEvent(event: ServerEvent) {
    switch (event.type) {
      case "conversation/created":
        conversations.setData((conversations) => [
          event.payload,
          ...conversations,
        ]);
        break;
      case "message/created":
        updateConversationLatestMessage(event.payload);
        break;
      case "error":
        toast({
          permanent: true,
          title: "Failed to subscribe to updates, please refresh the page.",
          description: event.payload.message,
        });
        break;
    }
  }

  async function onLogoutClick() {
    const result = await logout.execute();

    if (result.error) {
      toast({
        title: "Failed to logout, please try again.",
        description: result.error.message,
      });
    } else {
      setSession(null);
    }
  }

  function onSearchClearClick() {
    setInputs({ search: "" });
  }

  function onConversationClick(conversation: Conversation) {
    setLocation(`${paths.conversations}/${conversation.id}`);
  }

  async function onMessageSubmit() {
    const params: CreateMessageParams = {
      conversationId: selectedConversation!.id,
      content: inputs.message.trim(),
    };

    const result = await createMessage.execute(params);

    if (result.error) {
      toast({
        title: "Failed to send message, please try again.",
        description: result.error.message,
      });
    } else {
      const message = result.data;

      messages.setData((messages) => [message, ...messages]);
      updateConversationLatestMessage(message);
      setInputs({ message: "" });
    }
  }

  function onCreateConversationClick() {
    setIsModalOpen(true);
  }

  function onCreateConversationModalClose() {
    setIsModalOpen(false);
  }

  function onConversationCreated(conversation: Conversation) {
    conversations.setData((conversations) => [conversation, ...conversations]);
    setIsModalOpen(false);
    setLocation(`${paths.conversations}/${conversation.id}`);
  }

  /**
   * Update a conversation's `latestMessage` and moves the updated conversation
   * to the first position as it will have the most recent message.
   */
  function updateConversationLatestMessage(message: Message) {
    conversations.setData((conversations) =>
      conversations
        .map((conversation) => {
          if (conversation.id === message.conversationId) {
            return { ...conversation, latestMessage: message };
          }

          return conversation;
        })
        .sort((a, b) => {
          return a.id === message.conversationId
            ? -1
            : b.id === message.conversationId
            ? 1
            : 0;
        })
    );
  }

  return (
    <div className={styles.conversations}>
      <Card>
        <span className={styles.conversationsPanel}>
          <h2>Conversations</h2>
          <SearchBox
            name="search"
            disabled={conversations.isLoading || !!conversations.error}
            value={inputs.search}
            onInput={onInput}
            onClear={onSearchClearClick}
          />
          <ConversationsPane
            search={inputs.search}
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationClick={onConversationClick}
          />
          <Button
            color="foreground"
            disabled={conversations.isLoading || !!conversations.error}
            onClick={onCreateConversationClick}
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
            messages={messages}
            selectedConversation={selectedConversation}
          />
          <MessageBox
            isLoading={createMessage.isLoading}
            name="message"
            disabled={
              conversations.isLoading ||
              !!conversations.error ||
              messages.isLoading ||
              !!messages.error
            }
            value={inputs.message}
            onInput={onInput}
            onSubmit={onMessageSubmit}
          />
        </span>
      </Card>
      <FixedElement position="topRight">
        <Button
          color="ghost"
          disabled={logout.isLoading}
          spinner={logout.isLoading}
          onClick={onLogoutClick}
        >
          Logout
        </Button>
      </FixedElement>
      {isModalOpen && (
        <CreateConversationModal
          contacts={contacts}
          onClose={onCreateConversationModalClose}
          onConversationCreated={onConversationCreated}
        />
      )}
    </div>
  );
}
