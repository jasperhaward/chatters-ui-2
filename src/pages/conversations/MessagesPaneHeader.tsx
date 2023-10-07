import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./MessagesPaneHeader.module.scss";

import { Conversation as IConversation } from "@/types";
import { Icon, IconButton, Popover, PopoverContainer } from "@/components";
import { useSession } from "@/features/auth";

import { buildConversationTitle } from "./utils";
import Recipient from "./Recipient";

export interface MessagesPaneHeaderProps {
  selectedConversation: IConversation | undefined;
  onEditConversationClick: () => void;
}

export default function MessagesPaneHeader({
  selectedConversation,
  onEditConversationClick,
}: MessagesPaneHeaderProps) {
  const [session] = useSession();

  const isGroupConversation =
    selectedConversation && selectedConversation.recipients.length > 1;
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

  return (
    <div>
      <div className={styles.title}>
        <h2>
          {selectedConversation
            ? buildConversationTitle(selectedConversation)
            : "Messages"}
        </h2>
        {isGroupConversation && (
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
          </div>
        )}
      </div>
      {selectedConversation && (
        <p className={styles.description}>
          Conversation created by
          {isConversationCreatedByUser
            ? " you "
            : ` ${selectedConversation.createdBy.username} `}
          {formatConversationCreatedAt(selectedConversation.createdAt)}.
        </p>
      )}
      <hr />
    </div>
  );
}
