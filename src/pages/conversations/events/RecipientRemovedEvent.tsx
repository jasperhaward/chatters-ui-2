import styles from "./RecipientRemovedEvent.module.scss";

import { RecipientRemovedEvent as IRecipientRemovedEvent } from "@/types";
import { useSession } from "@/features/auth";

export interface RecipientRemovedEventProps {
  event: IRecipientRemovedEvent;
}

export default function RecipientRemovedEvent({
  event,
}: RecipientRemovedEventProps) {
  const [session] = useSession();

  const isEventCreatedByUser = event.createdBy.id === session.user.id;

  const author = isEventCreatedByUser ? "You" : event.createdBy.username;

  return (
    <div className={styles.recipientRemoved}>
      {author} removed {event.recipient.username}
    </div>
  );
}
