import { ComponentChildren } from "preact";
import styles from "./GenericEvent.module.scss";

import { ConversationEventWithAggregates } from "@/types";
import { useIsCreatedByUser } from "./useIsCreatedByUser";

interface GenericEventProps {
  event: ConversationEventWithAggregates;
  children: ComponentChildren;
}

export default function GenericEvent({ event, children }: GenericEventProps) {
  const isEventCreatedByUser = useIsCreatedByUser(event);
  const author = isEventCreatedByUser ? "You" : event.createdBy.username;

  return (
    <div className={styles.genericEvent}>
      {author} {children}
    </div>
  );
}
