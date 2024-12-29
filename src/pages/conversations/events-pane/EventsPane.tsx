import { useMemo } from "preact/hooks";
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
  ConversationEventCommon,
  ConversationEventWithAggregates,
} from "@/types";
import { useScrollIntoView } from "@/hooks";

import RetryableApiError from "../RetryableApiError";
import Event from "./Event";
import EventSkeleton from "./EventSkeleton";

export interface EventsPaneProps {
  events: UseQuery<ConversationEventWithAggregates[]>;
}

export default function EventsPane({ events }: EventsPaneProps) {
  const ref = useScrollIntoView<HTMLDivElement>([events.data]);

  const layout = useMemo(() => {
    if (!events.data) {
      return null;
    }

    return events.data.map((event, index, events) => ({
      previousEvent: events[index + 1],
      event,
      nextEvent: events[index - 1],
    }));
  }, [events.data]);

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
        <div className={styles.events}>
          {layout!.map(({ previousEvent, event, nextEvent }) => (
            <Fragment key={event.id}>
              <Event
                previousEvent={previousEvent}
                event={event}
                nextEvent={nextEvent}
              />
              {isDisplayDatestamp(previousEvent, event) && (
                <EventCreatedDatestamp event={event} />
              )}
            </Fragment>
          ))}
        </div>
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
  previousEvent: ConversationEventCommon | undefined,
  event: ConversationEventCommon
) {
  return (
    !previousEvent ||
    !isSameDay(new Date(event.createdAt), new Date(previousEvent.createdAt))
  );
}

interface EventCreatedDatestampProps {
  event: ConversationEventCommon;
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
