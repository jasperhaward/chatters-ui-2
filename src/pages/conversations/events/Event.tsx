import { ConversationEvent, ConversationEventType } from "@/types";
import { useSession } from "@/features/auth";

import ConversationCreatedEvent from "./ConversationCreatedEvent";
import MessageCreatedEvent from "./MessageCreatedEvent";
import RecipientCreatedEvent from "./RecipientCreatedEvent";
import RecipientRemovedEvent from "./RecipientRemovedEvent";
import TitleUpdatedEvent from "./TitleUpdatedEvent";
import { isWithinFiveMinutes } from "../utils";

export interface EventProps {
  previousEvent: ConversationEvent;
  event: ConversationEvent;
  nextEvent: ConversationEvent;
}

export default function Event({ previousEvent, event, nextEvent }: EventProps) {
  const [session] = useSession();

  const isCreatedByUser = event.createdBy.id === session.user.id;

  switch (event.type) {
    case "ConversationCreated":
      return <ConversationCreatedEvent event={event} />;
    case "TitleUpdated":
      return <TitleUpdatedEvent event={event} />;
    case "RecipientCreated":
      return <RecipientCreatedEvent event={event} />;
    case "RecipientRemoved":
      return <RecipientRemovedEvent event={event} />;
    case "MessageCreated":
      return (
        <MessageCreatedEvent
          event={event}
          isCreatedByUser={isCreatedByUser}
          isDisplayAuthor={
            isCreatedByUser
              ? false
              : isDisplayMessageAuthor(previousEvent, event)
          }
          isDisplayTimestamp={isDisplayMessageTimestamp(event, nextEvent)}
        />
      );
    default:
      throw new Error(`Unknown event type - '${event.type}'`);
  }
}

/**
 * Determines whether a `MessageCreated` event's (that wasn't created
 * by the urrent user) author & avatar should be displayed.
 * @param prevEvent
 * @param event
 * @returns true if:
 *  - there is no `prevEvent` or;
 *  - `prevEvent` is not a `MessageCreated` event or;
 *  - `event` & `prevEvent` were created by different users
 */
function isDisplayMessageAuthor(
  prevEvent: ConversationEvent | undefined,
  event: ConversationEvent
) {
  return (
    !prevEvent ||
    prevEvent.type !== ConversationEventType.MessageCreated ||
    event.createdBy.id !== prevEvent.createdBy.id
  );
}

/**
 * Determines whether a `MessageCreated` event's timestamp should be displayed.
 * @param event
 * @param nextEvent
 * @returns true if:
 *  - there is no `nextEvent` or;
 *  - `nextEvent` is not a `MessageCreated` event or;
 *  - `event` and `nextEvent` were created by different users or;
 *  - `event` and `nextEvent` were sent more than 5 minutes apart
 */
function isDisplayMessageTimestamp(
  event: ConversationEvent,
  nextEvent: ConversationEvent | undefined
) {
  return (
    !nextEvent ||
    nextEvent.type !== ConversationEventType.MessageCreated ||
    event.createdBy.id !== nextEvent.createdBy.id ||
    !isWithinFiveMinutes(event, nextEvent)
  );
}
