import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import { useLocation } from "wouter-preact";
import styles from "./ConversationHeader.module.scss";

import { paths } from "@/App";
import { Conversation, Conversation as IConversation } from "@/types";
import { Icon, IconButton, Popover } from "@/components";
import { useRemoveRecipient } from "@/api";
import { useIsMobile } from "@/hooks";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";

import { isConversationGroupConversation } from "./utils";
import { useIsCreatedByUser } from "./useIsCreatedByUser";
import { useConversationTitle } from "./useConversationTitle";
import RecipientsPopover from "./RecipientsPopover";

interface ConversationHeaderProps {
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
  const deleteRecipient = useRemoveRecipient();
  const title = useConversationTitle(selectedConversation);
  const isConversationCreatedByUser = useIsCreatedByUser(selectedConversation);

  const author = isConversationCreatedByUser
    ? " you "
    : ` ${selectedConversation?.createdBy.username} `;

  function onBackClick() {
    setLocation(paths.conversations);
  }

  async function onLeaveConversationClick() {
    const result = await deleteRecipient.execute({
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

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>
          {isMobile && (
            <IconButton
              className={styles.back}
              icon={["fas", "angle-left"]}
              onClick={onBackClick}
            />
          )}
          <h2>{title}</h2>
        </div>
        <div className={styles.menu}>
          <Popover content={<RecipientsPopover {...selectedConversation} />}>
            <Icon
              className={styles.recipientsIcon}
              icon={["fas", "user-group"]}
            />
          </Popover>
          <IconButton
            className={styles.button}
            icon={["fas", "pen"]}
            onClick={onEditConversationClick}
          />
          {isConversationGroupConversation(selectedConversation) && (
            <IconButton
              className={styles.button}
              icon={["fas", "right-from-bracket"]}
              onClick={onLeaveConversationClick}
            />
          )}
        </div>
      </div>
      <p className={styles.description}>
        Conversation created by
        {author}
        {formatConversationCreatedAt(selectedConversation)}.
      </p>
      <hr />
    </div>
  );
}

function formatConversationCreatedAt(conversation: Conversation) {
  const date = new Date(conversation.createdAt);

  if (isToday(date)) {
    return "today";
  } else if (isYesterday(date)) {
    return "yesterday";
  } else if (isThisWeek(date)) {
    return `on ${format(date, "EEEE")}`;
  } else if (isThisYear(date)) {
    return `in ${format(date, "MMMM")}`;
  } else {
    return "last year";
  }
}
