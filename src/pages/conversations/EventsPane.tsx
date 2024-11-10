import { useRef, useEffect, useMemo } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import {
  isSameDay,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  format,
} from "date-fns";
import styles from "./EventsPane.module.scss";

import { UseQuery } from "@/api";
import {
  ConversationEvent,
  ConversationEventType,
  RecipientCreatedEvent,
} from "@/types";

import EventSkeleton from "./EventSkeleton";
import RetryableApiError from "./RetryableApiError";
import Event from "./events/Event";
import { isWithinFiveMinutes } from "./utils";

export interface EventWithMetadata {
  previousEvent: ConversationEvent;
  event: ConversationEvent | RecipientCreatedEvent[];
  nextEvent: ConversationEvent;
}

export interface EventsPaneProps {
  events: UseQuery<ConversationEvent[]>;
}

export default function EventsPane({ events }: EventsPaneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events.data]);

  const layout = useMemo(() => {
    if (!events.data) {
      return null;
    }

    const reversedEvents = events.data.slice().reverse();

    const resultingEvents: EventWithMetadata[] = [];
    let groupedEvents: RecipientCreatedEvent[] = [];

    for (let index = 0; index < reversedEvents.length - 1; index++) {
      const previousEvent = reversedEvents[index - 1];
      const event = reversedEvents[index];
      const nextEvent = reversedEvents[index + 1];

      if (
        event.type === ConversationEventType.RecipientCreated &&
        nextEvent?.type === ConversationEventType.RecipientCreated &&
        event.createdBy.id === nextEvent?.createdBy.id &&
        isWithinFiveMinutes(event, nextEvent)
      ) {
        groupedEvents.push(event);
      } else if (
        event.type === ConversationEventType.RecipientCreated &&
        groupedEvents.length > 0
      ) {
        groupedEvents.push(event);

        resultingEvents.push({
          previousEvent,
          event: groupedEvents,
          nextEvent,
        });
      } else {
        groupedEvents = [];
        resultingEvents.push({ previousEvent, event, nextEvent });
      }
    }

    return resultingEvents;
  }, [events.data]);

  console.log(layout);

  return (
    <div className={styles.eventsPane}>
      {events.isLoading ? (
        <>
          <EventSkeleton isAlignRight width="40%" />
          <EventSkeleton isAlignRight width="35%" />
          <EventSkeleton isDisplayAvatar width="40%" />
          <EventSkeleton isAlignRight width="45%" />
          <EventSkeleton isDisplayAvatar width="35%" />
          <EventSkeleton width="45%" />
          <EventSkeleton isAlignRight width="35%" />
          <EventSkeleton isDisplayAvatar width="40%" />
          <EventSkeleton width="35%" />
        </>
      ) : events.error ? (
        <RetryableApiError onRetryClick={events.retry}>
          Failed to load conversation, please try again.
        </RetryableApiError>
      ) : (
        layout!.map(({ previousEvent, event, nextEvent }, index) =>
          Array.isArray(event) ? (
            <Fragment key={index}>
              {isDisplayDatestamp(previousEvent, event[0]!) && (
                <EventCreatedDatestamp event={event[0]!} />
              )}
              <Event
                previousEvent={previousEvent}
                event={event}
                nextEvent={nextEvent}
              />
            </Fragment>
          ) : (
            <Fragment key={index}>
              {isDisplayDatestamp(previousEvent, event) && (
                <EventCreatedDatestamp event={event} />
              )}
              <Event
                previousEvent={previousEvent}
                event={event}
                nextEvent={nextEvent}
              />
            </Fragment>
          )
        )
      )}
      <div ref={ref} />
    </div>
  );
}

/**
 * Determines whether a datestamp between two events should be shown.
 * @param previousEvent
 * @param event
 * @returns true if:
 *  - there is no `prevEvent`, ie `event` is the first event or;
 *  - `event` & `prevEvent` were sent on different days
 */
function isDisplayDatestamp(
  previousEvent: ConversationEvent | undefined,
  event: ConversationEvent
) {
  return (
    !previousEvent ||
    !isSameDay(new Date(event.createdAt), new Date(previousEvent.createdAt))
  );
}

interface EventCreatedDatestampProps {
  event: ConversationEvent;
}

function EventCreatedDatestamp({ event }: EventCreatedDatestampProps) {
  const date = new Date(event.createdAt);

  let datestamp;

  if (isToday(date)) {
    datestamp = "Today";
  } else if (isYesterday(date)) {
    datestamp = "Yesterday";
  } else if (isThisWeek(date)) {
    datestamp = format(date, "EEEE");
  } else if (isThisYear(date)) {
    datestamp = format(date, "d LLLL");
  } else {
    datestamp = format(date, "d LLLL yyyy");
  }

  return <time className={styles.datestamp}>{datestamp}</time>;
}
