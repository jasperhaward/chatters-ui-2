import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./MessagesPaneHeader.module.scss";

import { Conversation as IConversation } from "@/types";
import { IconButton } from "@/components";
import { useSession } from "@/features/auth";
import { buildConversationTitle } from "./utils";

export interface MessagesPaneHeaderProps {
  selectedConversation: IConversation | undefined;
  onEditConversationClick: () => void;
}

export default function MessagesPaneHeader({
  selectedConversation,
  onEditConversationClick,
}: MessagesPaneHeaderProps) {
  const [session] = useSession();

  const isConversationCreatedByUser =
    selectedConversation?.createdBy.id === session.user.id;

  function formatRelativeCreatedAt(timestamp: string) {
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
    <div className={styles.messagesPaneHeader}>
      <div className={styles.title}>
        <h2>
          {selectedConversation
            ? buildConversationTitle(selectedConversation)
            : "Messages"}
        </h2>
        <div className={styles.buttons}>
          <IconButton
            icon={["fas", "user-group"]}
            onClick={onEditConversationClick}
          />
          <IconButton
            className={styles.editConversation}
            icon={["fas", "pen-to-square"]}
            onClick={onEditConversationClick}
          />
        </div>
      </div>
      {selectedConversation && (
        <div className={styles.description}>
          Conversation created by
          {isConversationCreatedByUser
            ? " you "
            : ` ${selectedConversation.createdBy.username} `}
          {formatRelativeCreatedAt(selectedConversation.createdAt)}.
        </div>
      )}
      <hr />
    </div>
  );
}
