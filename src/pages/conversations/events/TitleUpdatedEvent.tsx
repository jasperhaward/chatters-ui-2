import styles from "./TitleUpdatedEvent.module.scss";

import { TitleUpdatedEvent as ITitleUpdatedEvent } from "@/types";
import { useSession } from "@/features/auth";

export interface TitleUpdatedProps {
  event: ITitleUpdatedEvent;
}

export default function TitleUpdatedEvent({ event }: TitleUpdatedProps) {
  const [session] = useSession();

  const isEventCreatedByUser = event.createdBy.id === session.user.id;

  const author = isEventCreatedByUser ? "You" : event.createdBy.username;

  return (
    <div className={styles.titleUpdated}>
      {author}
      {event.title
        ? ` changed the title to - ${event.title}`
        : " removed the title"}
    </div>
  );
}
