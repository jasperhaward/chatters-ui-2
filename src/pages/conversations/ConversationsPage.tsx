import { useEffect, useMemo } from "preact/hooks";
import { useLocation } from "wouter-preact";
import styles from "./ConversationsPage.module.scss";

import { paths } from "@/App";
import {
  useConversations,
  useEvents,
  useCreateMessage,
  useContacts,
  useConversationEvents,
} from "@/api";
import {
  AddedToConversationEvent,
  Conversation,
  MessageCreatedEvent,
  Recipient,
  RecipientCreatedEvent,
  RecipientRemovedEvent,
  TitleUpdatedEvent,
  WebSocketConversationEvent,
} from "@/types";
import { useInputs, useIsMobile } from "@/hooks";
import { Button, Card } from "@/components";
import { UserMenu, useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";
import { useModal } from "@/features/modal";

import { sortConversationsByLatestEvent, sortUsersByUsername } from "./utils";
import CreateConversationForm from "./CreateConversationForm";
import ConversationHeader from "./ConversationHeader";
import EventsPane from "./events-pane/EventsPane";
import MessageBox from "./MessageBox";
import SearchBox from "./SearchBox";
import ConversationsPane from "./conversations-pane/ConversationsPane";

interface ConversationsPageProps {
  conversationId?: string;
}

export default function ConversationsPage({
  conversationId,
}: ConversationsPageProps) {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  const [session] = useSession();
  const [toast, clearToasts] = useToasts();
  const modal = useModal();

  const [inputs, onInput, setInputs] = useInputs({
    search: "",
    message: "",
  });

  const conversations = useConversations();
  const contacts = useContacts();
  const createMessage = useCreateMessage();
  const disconnectWebsocket = useConversationEvents(onConversationEvent);

  const selectedConversation = useMemo(() => {
    if (!conversations.data || !conversationId) {
      return;
    }

    return conversations.data.find((conversation) => {
      return conversation.conversationId === conversationId;
    });
  }, [conversations.data, conversationId]);

  const events = useEvents(selectedConversation?.conversationId || null);

  useEffect(() => {
    if (
      !isMobile &&
      conversations.data &&
      conversations.data.length > 0 &&
      !selectedConversation
    ) {
      const firstConversation = conversations.data[0];

      setLocation(`${paths.conversations}/${firstConversation.conversationId}`);
    }
  }, [conversations.data, selectedConversation]);

  useEffect(() => {
    // clear toasts & disconnect from conversation websocket events on unmount
    return () => {
      disconnectWebsocket();
      clearToasts();
    };
  }, []);

  function onConversationEvent(event: WebSocketConversationEvent) {
    switch (event.type) {
      case "AddedToConversation":
        onAddedToConversation(event);
        break;
      case "TitleUpdated":
        onTitleUpdated(event);
        break;
      case "MessageCreated":
        onMessageCreated(event);
        break;
      case "RecipientCreated":
        onRecipientCreated(event);
        break;
      case "RecipientRemoved":
        onRecipientRemoved(event);
        break;
    }
  }

  function onAddedToConversation(event: AddedToConversationEvent) {
    // if the conversation was created by the current user, select the conversation
    if (event.createdBy.id === session.user.id) {
      setLocation(`${paths.conversations}/${event.conversationId}`);
    }

    conversations.setData((conversations) => [event, ...conversations]);
  }

  function onTitleUpdated(event: TitleUpdatedEvent) {
    if (event.conversationId === selectedConversation?.conversationId) {
      events.setData((events) => [event, ...events]);
    }

    conversations.setData((conversations) => {
      return conversations
        .map((conversation) => {
          if (conversation.conversationId === event.conversationId) {
            return {
              ...conversation,
              title: event.title,
              latestEvent: event,
            };
          }

          return conversation;
        })
        .sort(sortConversationsByLatestEvent);
    });
  }

  function onMessageCreated(event: MessageCreatedEvent) {
    if (event.conversationId === selectedConversation?.conversationId) {
      events.setData((events) => [event, ...events]);
    }

    conversations.setData((conversations) => {
      return conversations
        .map((conversation) => {
          if (conversation.conversationId === event.conversationId) {
            return { ...conversation, latestEvent: event };
          }

          return conversation;
        })
        .sort(sortConversationsByLatestEvent);
    });
  }

  function onRecipientCreated(event: RecipientCreatedEvent) {
    if (event.conversationId === selectedConversation?.conversationId) {
      events.setData((events) => [event, ...events]);
    }

    conversations.setData((conversations) => {
      return conversations
        .map((conversation) => {
          if (conversation.conversationId === event.conversationId) {
            const recipient: Recipient = {
              ...event.recipient,
              createdAt: event.createdAt,
              createdBy: event.createdBy,
            };

            const updatedRecipients = [...conversation.recipients, recipient];

            return {
              ...conversation,
              recipients: updatedRecipients.sort(sortUsersByUsername),
              latestEvent: event,
            };
          }

          return conversation;
        })
        .sort(sortConversationsByLatestEvent);
    });
  }

  function onRecipientRemoved(event: RecipientRemovedEvent) {
    if (event.conversationId === selectedConversation?.conversationId) {
      events.setData((events) => [event, ...events]);
    }

    // remove the conversation from the inbox when either the user is removed from
    // the conversation by another recipient or leaves themselves
    if (event.recipient.id === session.user.id) {
      return conversations.setData((conversations) => {
        return conversations.filter((conversation) => {
          return conversation.conversationId !== event.conversationId;
        });
      });
    }

    conversations.setData((conversations) => {
      return conversations
        .map((conversation) => {
          if (conversation.conversationId === event.conversationId) {
            return {
              ...conversation,
              recipients: conversation.recipients.filter((recipient) => {
                return recipient.id !== event.recipient.id;
              }),
              latestEvent: event,
            };
          }

          return conversation;
        })
        .sort(sortConversationsByLatestEvent);
    });
  }

  async function onMessageCreationSubmit() {
    const result = await createMessage.execute({
      conversationId: selectedConversation!.conversationId,
      content: inputs.message.trim(),
    });

    if (result.error) {
      toast({
        title: "Failed to send message, please try again.",
        description: result.error.message,
      });
    } else {
      setInputs({ message: "" });
    }
  }

  function onSearchClearClick() {
    setInputs({ search: "" });
  }

  function onConversationClick(conversation: Conversation) {
    if (inputs.search !== "") {
      setInputs({ search: "" });
    }

    setLocation(`${paths.conversations}/${conversation.conversationId}`);
  }

  function onCreateConversationClick() {
    modal({
      title: "Create conversation",
      content: (onClose) => (
        <CreateConversationForm
          contacts={contacts}
          onConversationCreated={onClose}
        />
      ),
    });
  }

  const eventsPanel = useMemo(
    () => (
      <>
        <ConversationHeader
          selectedConversation={selectedConversation}
          contacts={contacts}
        />
        <EventsPane events={events} />
        <MessageBox
          name="message"
          isLoading={createMessage.isLoading}
          disabled={
            conversations.isLoading || !!conversations.error || events.isLoading
          }
          value={inputs.message}
          onInput={onInput}
          onSubmit={onMessageCreationSubmit}
        />
      </>
    ),
    [
      selectedConversation,
      contacts.isLoading,
      events.isLoading,
      conversations.isLoading,
      inputs.message,
    ]
  );

  const conversationsPanel = useMemo(
    () => (
      <>
        <div className={styles.conversationsHeading}>
          <h2>Conversations</h2>
          <UserMenu />
        </div>
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
      </>
    ),
    [selectedConversation, conversations.isLoading, inputs.search]
  );

  if (isMobile) {
    if (selectedConversation) {
      return <div className={styles.mobilePanel}>{eventsPanel}</div>;
    } else {
      return <div className={styles.mobilePanel}>{conversationsPanel}</div>;
    }
  }

  return (
    <div className={styles.desktopPanel}>
      <Card>
        <span className={styles.conversationsPanel}>{conversationsPanel}</span>
        <span className={styles.eventsPanel}>{eventsPanel}</span>
      </Card>
    </div>
  );
}
