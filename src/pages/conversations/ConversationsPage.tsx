import { useEffect, useMemo, useState } from "preact/hooks";
import { useLocation } from "wouter";
import styles from "./ConversationsPage.module.scss";

import { paths } from "@/App";
import {
  useConversations,
  useEvents,
  useLogout,
  useCreateMessage,
  useConversationEventUpdates,
  useContacts,
  ErrorEvent,
} from "@/api";
import {
  AddedToConversationEvent,
  Conversation,
  ConversationEvent,
  MessageCreatedEvent,
  Recipient,
  RecipientCreatedEvent,
  RecipientRemovedEvent,
  TitleUpdatedEvent,
} from "@/types";
import { useInputs } from "@/hooks";
import { FixedElement, Button, Card, Modal } from "@/components";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";

import { sortConversationsByLatestEvent, sortUsersByUsername } from "./utils";
import ConversationsPane from "./ConversationsPane";
import SearchBox from "./SearchBox";
import MessageBox from "./MessageBox";
import EventsPane from "./EventsPane";
import CreateConversationForm from "./CreateConversationForm";
import EditConversationForm from "./EditConversationForm";
import ConversationHeader from "./ConversationHeader";

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
  const disconnectServerEvents = useConversationEventUpdates({
    onEvent: onConversationEvent,
    onError: onConversationError,
  });

  const selectedConversation = useMemo(() => {
    if (!conversations.data || !params.conversationId) {
      return;
    }

    return conversations.data.find((conversation) => {
      return conversation.conversationId === params.conversationId;
    });
  }, [conversations.data, params.conversationId]);

  const events = useEvents(selectedConversation?.conversationId || null);

  useEffect(() => {
    if (
      conversations.data &&
      conversations.data.length > 0 &&
      !selectedConversation
    ) {
      const firstConversation = conversations.data[0]!;

      setLocation(`${paths.conversations}/${firstConversation.conversationId}`);
    }
  }, [conversations.data, selectedConversation]);

  useEffect(() => {
    // clear toasts & disconnect from server events on unmount
    return () => {
      disconnectServerEvents();
      clearToasts();
    };
  }, []);

  function onConversationEvent(event: ConversationEvent) {
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

    conversations.setData((conversations) => {
      // if the current user is the recipient being removed, remove the conversation
      if (event.recipient.id === session.user.id) {
        return conversations.filter((conversation) => {
          return conversation.conversationId !== event.conversationId;
        });
      }

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

  function onConversationError(event: ErrorEvent) {
    toast({
      permanent: true,
      title: "Failed to subscribe to updates, please refresh the page.",
      description: event.message,
    });
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

    setLocation(`${paths.conversations}/${conversation.conversationId}`);
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

  function onCreateConversationClick() {
    setActiveModal("CreateConversation");
  }

  function onEditConversationClick() {
    setActiveModal("EditConversation");
  }

  function onModalClose() {
    setActiveModal(null);
  }

  function onLeaveSelectedConversation() {
    conversations.setData((conversations) => {
      return conversations.filter((conversation) => {
        return (
          conversation.conversationId !== selectedConversation!.conversationId
        );
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
              onConversationCreated={onModalClose}
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
            />
          ),
        };
    }
  }, [activeModal, contacts, selectedConversation]);

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
          <ConversationHeader
            selectedConversation={selectedConversation}
            onLeaveSelectedConversation={onLeaveSelectedConversation}
            onEditConversationClick={onEditConversationClick}
          />
          <EventsPane events={events} />
          <MessageBox
            isLoading={createMessage.isLoading}
            name="message"
            disabled={
              conversations.isLoading ||
              !!conversations.error ||
              events.isLoading
            }
            value={inputs.message}
            onInput={onInput}
            onSubmit={onMessageCreationSubmit}
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
