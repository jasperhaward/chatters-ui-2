import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./ConversationHeader.module.scss";

import { Conversation, Conversation as IConversation } from "@/types";
import { Icon, IconButton, Popover } from "@/components";
import { useRemoveRecipient } from "@/api";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";

import { isConversationGroupConversation } from "./utils";
import { useIsCreatedByUser } from "./useIsCreatedByUser";
import Recipient from "./Recipient";
import ConversationTitle from "./ConversationTitle";

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
  const [session] = useSession();
  const [toast] = useToasts();
  const deleteRecipient = useRemoveRecipient();
  const isConversationCreatedByUser = useIsCreatedByUser(selectedConversation);

  const author = isConversationCreatedByUser
    ? " you "
    : ` ${selectedConversation?.createdBy.username} `;

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
      <div className={styles.title}>
        <h2>
          <ConversationTitle conversation={selectedConversation} />
        </h2>
        <div className={styles.menu}>
          <Popover
            content={
              <>
                <h3>Recipients</h3>
                <div className={styles.recipientsContainer}>
                  {selectedConversation.recipients.map((recipient) => (
                    <Recipient key={recipient.id} recipient={recipient} />
                  ))}
                </div>
              </>
            }
          >
            <Icon
              className={styles.recipientsIcon}
              icon={["fas", "user-group"]}
            />
          </Popover>
          <IconButton
            className={styles.editConversation}
            icon={["fas", "pen-to-square"]}
            onClick={onEditConversationClick}
          />
          {isConversationGroupConversation(selectedConversation) && (
            <IconButton
              className={styles.leaveConversation}
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
