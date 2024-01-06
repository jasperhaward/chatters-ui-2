import { useEffect, useMemo, useState } from "preact/hooks";
import { useLocation } from "wouter";
import styles from "./ConversationsPage.module.scss";

import { paths } from "@/App";
import {
  useConversations,
  useMessages,
  useLogout,
  useCreateMessage,
  ServerEvent,
  useServerEvents,
  useContacts,
} from "@/api";
import {
  Conversation,
  ConversationWithoutRecipientsLatestMessage,
  Message,
  Recipient,
} from "@/types";
import { useInputs } from "@/hooks";
import { FixedElement, Button, Card, Modal } from "@/components";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";

import {
  sortConversationsByLatestMessageOrCreatedAt,
  sortUsersByUsername,
} from "./utils";
import ConversationsPane from "./ConversationsPane";
import SearchBox from "./SearchBox";
import MessageBox from "./MessageBox";
import MessagesPane from "./MessagesPane";
import CreateConversationForm from "./CreateConversationForm";
import EditConversationForm from "./EditConversationForm";
import MessagesPaneHeader from "./MessagesPaneHeader";

type Modal = "CreateConversation" | "EditConversation";

export interface ChatProps {
  params: {
    conversationId?: string;
  };
}

export default function ConversationsPage({ params }: ChatProps) {
  const [session, setSession] = useSession();
  const [location, setLocation] = useLocation();
  const [toast, clearToasts] = useToasts();

  const [activeModal, setActiveModal] = useState<Modal | null>(null);
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

  const messages = useMessages(selectedConversation?.id || null);

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
        onConversationCreated(event.payload);
        break;
      case "conversation/updated":
        onConversationUpdated(event.payload);
        break;
      case "message/created":
        onMessageCreated(event.payload);
        break;
      case "recipient/added":
        onRecipientAdded(event.payload);
        break;
      case "recipient/removed":
        onRecipientRemoved(event.payload);
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
    if (inputs.search !== "") {
      setInputs({ search: "" });
    }

    setLocation(`${paths.conversations}/${conversation.id}`);
  }

  async function onMessageSubmit() {
    const result = await createMessage.execute({
      conversationId: selectedConversation!.id,
      content: inputs.message.trim(),
    });

    if (result.error) {
      toast({
        title: "Failed to send message, please try again.",
        description: result.error.message,
      });
    } else {
      onMessageCreated(result.data);
      setInputs({ message: "" });
    }
  }

  function onCreateConversationClick() {
    setActiveModal("CreateConversation");
  }

  function onEditConversationClick() {
    setActiveModal("EditConversation");
  }

  function onModalClose() {
    setActiveModal(null);
  }

  function onConversationCreated(conversation: Conversation) {
    conversations.setData((conversations) => [conversation, ...conversations]);
  }

  function onConversationCreatedSubmit(conversation: Conversation) {
    onConversationCreated(conversation);
    setActiveModal(null);
    setLocation(`${paths.conversations}/${conversation.id}`);
  }

  function onConversationUpdated(
    updatedConversation: ConversationWithoutRecipientsLatestMessage
  ) {
    conversations.setData((conversations) => {
      return conversations.map((conversation) => {
        if (conversation.id === updatedConversation.id) {
          return { ...conversation, ...updatedConversation };
        }

        return conversation;
      });
    });
  }

  function onMessageCreated(message: Message) {
    if (message.conversationId === selectedConversation?.id) {
      messages.setData((messages) => [message, ...messages]);
    }

    conversations.setData((conversations) => {
      return conversations
        .map((conversation) => {
          if (conversation.id === message.conversationId) {
            return { ...conversation, latestMessage: message };
          }

          return conversation;
        })
        .sort(sortConversationsByLatestMessageOrCreatedAt);
    });
  }

  function onRecipientAdded(recipient: Recipient) {
    conversations.setData((conversations) => {
      return conversations.map((conversation) => {
        if (conversation.id === recipient.conversationId) {
          const updatedRecipients = [...conversation.recipients, recipient];

          return {
            ...conversation,
            recipients: updatedRecipients.sort(sortUsersByUsername),
          };
        }

        return conversation;
      });
    });
  }

  function onRecipientRemoved(removedRecipient: Recipient) {
    conversations.setData((conversations) => {
      // if the current user is the recipient being removed, remove the conversation
      if (removedRecipient.id === session.user.id) {
        return conversations.filter((conversation) => {
          return conversation.id !== removedRecipient.conversationId;
        });
      }

      return conversations.map((conversation) => {
        if (conversation.id === removedRecipient.conversationId) {
          return {
            ...conversation,
            recipients: conversation.recipients.filter((recipient) => {
              return recipient.id !== removedRecipient.id;
            }),
          };
        }

        return conversation;
      });
    });
  }

  const modal = useMemo(() => {
    switch (activeModal) {
      case "CreateConversation":
        return {
          title: "Create conversation",
          body: (
            <CreateConversationForm
              contacts={contacts}
              onConversationCreated={onConversationCreatedSubmit}
            />
          ),
        };
      case "EditConversation":
        return {
          title: "Edit conversation",
          body: (
            <EditConversationForm
              conversation={selectedConversation!}
              contacts={contacts}
              onConversationUpdated={onConversationUpdated}
              onRecipientAdded={onRecipientAdded}
              onRecipientRemoved={onRecipientRemoved}
            />
          ),
        };
    }
  }, [
    contacts,
    selectedConversation,
    onConversationCreatedSubmit,
    onConversationUpdated,
    onRecipientAdded,
    onRecipientRemoved,
  ]);

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
          <MessagesPaneHeader
            selectedConversation={selectedConversation}
            onEditConversationClick={onEditConversationClick}
          />
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
              messages.isLoading
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
      {modal && (
        <Modal title={modal.title} onClose={onModalClose}>
          {modal.body}
        </Modal>
      )}
    </div>
  );
}
