import { useLocation } from "wouter-preact";
import styles from "./ConversationHeader.module.scss";

import { paths } from "@/App";
import { Conversation, User } from "@/types";
import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuSection,
  Icon,
  IconButton,
} from "@/components";
import { UseQuery, useRemoveRecipient } from "@/api";
import { useIsMobile } from "@/hooks";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";
import { useModal } from "@/features/modal";

import { isConversationGroupConversation } from "./utils";
import { useConversationTitle } from "./useConversationTitle";
import RecipientsPopover from "./RecipientsPopover";
import EditTitleForm from "./EditTitleForm";
import EditRecipientsForm from "./EditRecipientsForm";

export interface ConversationHeaderProps {
  selectedConversation: Conversation | undefined;
  contacts: UseQuery<User[]>;
}

export default function ConversationHeader({
  selectedConversation,
  contacts,
}: ConversationHeaderProps) {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  const [session] = useSession();
  const [toast] = useToasts();
  const modal = useModal();
  const removeRecipient = useRemoveRecipient();
  const title = useConversationTitle(selectedConversation);

  function onBackClick() {
    setLocation(paths.conversations);
  }

  async function onLeaveConversationClick() {
    const result = await removeRecipient.execute({
      conversationId: selectedConversation!.conversationId,
      recipientId: session.user.id,
    });

    if (result.error) {
      toast({
        title: "Failed to leave conversation, please try again.",
        description: result.error.message,
      });
    }
  }

  function onEditTitleClick() {
    modal({
      title: "Title",
      content: () => <EditTitleForm conversation={selectedConversation!} />,
    });
  }

  function onEditRecipientsClick() {
    modal({
      title: "Recipients",
      content: () => (
        <EditRecipientsForm
          conversation={selectedConversation!}
          contacts={contacts}
        />
      ),
    });
  }

  if (!selectedConversation) {
    return (
      <div>
        <h2>Messages</h2>
        <hr />
      </div>
    );
  }

  const isGroupConversation =
    isConversationGroupConversation(selectedConversation);

  return (
    <div className={styles.header}>
      {isMobile && (
        <IconButton
          className={styles.back}
          icon={["fas", "arrow-left"]}
          onClick={onBackClick}
        />
      )}
      <Icon
        className={styles.icon}
        icon={["fas", isGroupConversation ? "users" : "user"]}
      />
      <div className={styles.details}>
        <h3>{title}</h3>
        <RecipientsPopover recipients={selectedConversation.recipients} />
      </div>
      <ContextMenu>
        <ContextMenuSection>
          <ContextMenuButton onClick={onEditTitleClick}>
            Edit title
          </ContextMenuButton>
          <ContextMenuButton onClick={onEditRecipientsClick}>
            Edit recipients
          </ContextMenuButton>
          {isGroupConversation && (
            <ContextMenuButton onClick={onLeaveConversationClick}>
              Leave conversation
            </ContextMenuButton>
          )}
        </ContextMenuSection>
      </ContextMenu>
    </div>
  );
}
