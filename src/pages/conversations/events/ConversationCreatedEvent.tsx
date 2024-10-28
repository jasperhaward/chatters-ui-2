import styles from "./ConversationCreatedEvent.module.scss";

import { ConversationCreatedEvent as IConversationCreatedEvent } from "@/types";
import { useSession } from "@/features/auth";

export interface ConversationCreatedEventProps {
  event: IConversationCreatedEvent;
}

export default function ConversationCreatedEvent({
  event,
}: ConversationCreatedEventProps) {
  const [session] = useSession();

  const isEventCreatedByUser = event.createdBy.id === session.user.id;

  const author = isEventCreatedByUser ? "you" : event.createdBy.username;

  return (
    <div className={styles.conversationCreated}>
      Conversation created by {author}
    </div>
  );
}
