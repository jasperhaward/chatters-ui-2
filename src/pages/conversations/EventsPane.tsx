import { useRef, useEffect } from "preact/hooks";
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
import { ConversationEvent } from "@/types";

import EventSkeleton from "./EventSkeleton";
import RetryableApiError from "./RetryableApiError";
import Event from "./events/Event";

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

  /**
   * Determines whether a datestamp between events should be shown.
   * @param prevEvent
   * @param event
   * @returns true if:
   *  - there is no `prevEvent`, ie `event` is the first event or;
   *  - `event` & `prevEvent` were sent on different days
   */
  function isDisplayDatestamp(
    prevEvent: ConversationEvent | undefined,
    event: ConversationEvent
  ) {
    return (
      !prevEvent ||
      !isSameDay(new Date(event.createdAt), new Date(prevEvent.createdAt))
    );
  }

  function formatDatestamp(timestamp: string) {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isThisWeek(date)) {
      return format(date, "EEEE");
    } else if (isThisYear(date)) {
      return format(date, "d LLLL");
    } else {
      return format(date, "d LLLL yyyy");
    }
  }

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
        events.data
          .slice()
          .reverse()
          .map((event, index, events) => {
            const prevEvent = events[index - 1];
            const nextEvent = events[index + 1];

            return (
              <Fragment key={"id" in event ? event.id : index}>
                {isDisplayDatestamp(prevEvent, event) && (
                  <time className={styles.datestamp}>
                    {formatDatestamp(event.createdAt)}
                  </time>
                )}
                <Event
                  prevEvent={prevEvent}
                  event={event}
                  nextEvent={nextEvent}
                />
              </Fragment>
            );
          })
      )}
      <div ref={ref} />
    </div>
  );
}
