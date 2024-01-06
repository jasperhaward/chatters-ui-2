import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import styles from "./Recipient.module.scss";

import { Recipient as IRecipient } from "@/types";
import { Icon } from "@/components";

export interface RecipientProps {
  recipient: IRecipient;
}

export default function Recipient({ recipient }: RecipientProps) {
  function formatCreatedAt(createdAt: string) {
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

  return (
    <div className={styles.recipient}>
      <Icon className={styles.avatar} icon={["fas", "user"]} />
      <div>
        <div>{recipient.username}</div>
        <time className={styles.timestamp}>
          Added {formatCreatedAt(recipient.createdAt)}
        </time>
      </div>
    </div>
  );
}
