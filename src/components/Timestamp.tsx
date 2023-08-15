import { useMemo } from "preact/hooks";

export interface TimestampProps {
  className?: string;
  /** ISO 8061 formatted date string. */
  timestamp: string;
  /**
   * Determines whether time is displayed, when false only dates/days are displayed
   * Defaults to true.
   */
  time?: boolean;
  /** Determines whether dates are shown in a short format. Defaults to false */
  short?: boolean;
}

export function Timestamp({
  className,
  timestamp,
  time = true,
  short,
}: TimestampProps) {
  const formattedTimestamp = useMemo(() => {
    const date = new Date(timestamp);

    if (date.isToday()) {
      if (time) {
        return date.toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      return "Today";
    } else if (date.isYesterday()) {
      return "Yesterday";
    } else if (date.isThisWeek()) {
      return date.toLocaleString("en-GB", {
        weekday: "long",
      });
    } else if (date.isThisYear()) {
      return date.toLocaleString("en-GB", {
        day: "numeric",
        month: short ? "short" : "long",
      });
    } else {
      return date.toLocaleString("en-GB", {
        day: short ? undefined : "numeric",
        month: short ? "short" : "long",
        year: "numeric",
      });
    }
  }, [timestamp]);

  return <time className={className}>{formattedTimestamp}</time>;
}
