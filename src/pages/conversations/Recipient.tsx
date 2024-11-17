import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./Recipient.module.scss";

import { Recipient as IRecipient } from "@/types";
import { Icon } from "@/components";
import { useSession } from "@/features/auth";

interface RecipientProps {
  recipient: IRecipient;
}

export default function Recipient({ recipient }: RecipientProps) {
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
