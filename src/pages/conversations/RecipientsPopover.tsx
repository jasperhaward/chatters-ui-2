import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./RecipientsPopover.module.scss";

import { Recipient as IRecipient } from "@/types";
import { Icon, Popover } from "@/components";
import { useSession } from "@/features/auth";

interface RecipientsPopoverProps {
  recipients: IRecipient[];
}

export default function RecipientsPopover({
  recipients,
}: RecipientsPopoverProps) {
  return (
    <Popover
      content={
        <>
          <h3>Recipients</h3>
          <div className={styles.recipients}>
            {recipients.map((recipient) => (
              <Recipient key={recipient.id} recipient={recipient} />
            ))}
          </div>
        </>
      }
    >
      <span className={styles.participants}>
        {recipients.length} participants
      </span>
    </Popover>
  );
}

interface RecipientProps {
  recipient: IRecipient;
}

function Recipient({ recipient }: RecipientProps) {
  const [session] = useSession();

  return (
    <div className={styles.recipient}>
      <Icon className={styles.avatar} icon={["fas", "user"]} />
      <div>
        <div>
          {recipient.id === session.user.id ? "You" : recipient.username}
        </div>
        <time className={styles.timestamp}>
          Added {formatRecipientCreatedAt(recipient.createdAt)}
        </time>
      </div>
    </div>
  );
}

function formatRecipientCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (isToday(date)) {
    return "today";
  } else if (isYesterday(date)) {
    return "yesterday";
  } else if (isThisWeek(date)) {
    return `on ${format(date, "EEEE")}`;
  } else if (isThisYear(date)) {
    return `on ${format(date, "do MMMM")}`;
  } else {
    return `on ${format(date, "do MMMM YYY")}`;
  }
}
