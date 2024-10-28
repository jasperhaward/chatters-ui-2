import styles from "./RecipientCreatedEvent.module.scss";

import { RecipientCreatedEvent as IRecipientCreatedEvent } from "@/types";
import { useSession } from "@/features/auth";

export interface RecipientCreatedEventProps {
  event: IRecipientCreatedEvent;
}

export default function RecipientCreatedEvent({
  event,
}: RecipientCreatedEventProps) {
  const [session] = useSession();

  const isEventCreatedByUser = event.createdBy.id === session.user.id;

  const author = isEventCreatedByUser ? "You" : event.createdBy.username;

  return (
    <div className={styles.recipientCreated}>
      {author} added {event.recipient.username}
    </div>
  );
}
