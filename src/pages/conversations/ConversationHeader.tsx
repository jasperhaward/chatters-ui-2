import { useLocation } from "wouter-preact";
import styles from "./ConversationHeader.module.scss";

import { paths } from "@/App";
import { Conversation as IConversation } from "@/types";
import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuSection,
  Icon,
  IconButton,
  Popover,
} from "@/components";
import { useRemoveRecipient } from "@/api";
import { useIsMobile } from "@/hooks";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";

import { isConversationGroupConversation } from "./utils";
import { useConversationTitle } from "./useConversationTitle";
import RecipientsPopover from "./RecipientsPopover";

export interface ConversationHeaderProps {
  selectedConversation: IConversation | undefined;
  onLeaveSelectedConversation: () => void;
  onEditConversationClick: () => void;
}

export default function ConversationHeader({
  selectedConversation,
  onLeaveSelectedConversation,
  onEditConversationClick,
}: ConversationHeaderProps) {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  const [session] = useSession();
  const [toast] = useToasts();
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
    } else {
      onLeaveSelectedConversation();
    }
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
      <div className={styles.title}>
        <h3>{title}</h3>
        <Popover
          content={
            <RecipientsPopover recipients={selectedConversation.recipients} />
          }
        >
          <span className={styles.participants}>
            {selectedConversation.recipients.length} participants
          </span>
        </Popover>
      </div>
      <ContextMenu>
        <ContextMenuSection>
          <ContextMenuButton color="ghost" onClick={onEditConversationClick}>
            Edit conversation
          </ContextMenuButton>
          {isGroupConversation && (
            <ContextMenuButton color="ghost" onClick={onLeaveConversationClick}>
              Leave conversation
            </ContextMenuButton>
          )}
        </ContextMenuSection>
      </ContextMenu>
    </div>
  );
}
