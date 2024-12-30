import styles from "./RecipientsCreatedAggregateEvent.module.scss";
import { RecipientsCreatedAggregateEvent as IRecipientsCreatedAggregateEvent } from "@/types";
import { Popover } from "@/components";
import GenericEvent from "./GenericEvent";

interface RecipientsCreatedAggregateEventProps {
  event: IRecipientsCreatedAggregateEvent;
}

export default function RecipientsCreatedAggregateEvent({
  event,
}: RecipientsCreatedAggregateEventProps) {
  // the user that created the RecipientsCreatedAggregate event
  // should be excluded from the list of names displayed in the event
  const recipients = event.recipients.filter((recipient) => {
    return recipient.id !== event.createdBy.id;
  });

  const primaryRecipients = recipients
    .slice(0, 2)
    .map((recipient) => recipient.username)
    .join(", ");
  const otherRecipients = recipients
    .slice(2)
    .map((recipient) => <div key={recipient.id}>{recipient.username}</div>);

  return (
    <GenericEvent event={event}>
      added {primaryRecipients}
      {otherRecipients.length > 0 && (
        <Popover content={otherRecipients}>
          <span className={styles.and}>and</span>
          <span className={styles.others}>
            {otherRecipients.length} other(s)
          </span>
        </Popover>
      )}
    </GenericEvent>
  );
}
