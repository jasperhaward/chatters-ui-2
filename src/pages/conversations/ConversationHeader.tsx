import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./ConversationHeader.module.scss";

import { Conversation as IConversation } from "@/types";
import { Icon, IconButton, Popover, PopoverContainer } from "@/components";
import { useRemoveRecipient } from "@/api";
import { useSession } from "@/features/auth";
import { useToasts } from "@/features/toasts";

import { buildConversationTitle } from "./utils";
import Recipient from "./Recipient";

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
  const [session] = useSession();
  const [toast] = useToasts();
  const deleteRecipient = useRemoveRecipient();

  const isConversationCreatedByUser =
    selectedConversation?.createdBy.id === session.user.id;

  function formatConversationCreatedAt(timestamp: string) {
    const date = new Date(timestamp);

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

  return (
    <div>
      {selectedConversation ? (
        <>
          <div className={styles.title}>
            <h2>
              {buildConversationTitle(selectedConversation, session.user.id)}
            </h2>
            <div className={styles.menu}>
              <PopoverContainer>
                <Icon
                  className={styles.recipientsIcon}
                  icon={["fas", "user-group"]}
                />
                <Popover>
                  <h3>Recipients</h3>
                  <div className={styles.recipientsContainer}>
                    {selectedConversation.recipients.map((recipient) => (
                      <Recipient key={recipient.id} recipient={recipient} />
                    ))}
                  </div>
                </Popover>
              </PopoverContainer>
              <IconButton
                className={styles.editConversation}
                icon={["fas", "pen-to-square"]}
                onClick={onEditConversationClick}
              />
              {selectedConversation.recipients.length > 2 && (
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
            {isConversationCreatedByUser
              ? " you "
              : ` ${selectedConversation.createdBy.username} `}
            {formatConversationCreatedAt(selectedConversation.createdAt)}.
          </p>
        </>
      ) : (
        <h2>Messages</h2>
      )}
      <hr />
    </div>
  );
}
