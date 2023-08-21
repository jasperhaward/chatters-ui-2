import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";

export interface TimestampProps {
  className?: string;
  /** Determines whether dates are shown in a short format. Defaults to false */
  short?: boolean;
  /** ISO 8061 formatted date string. */
  children: string;
}

export function Timestamp({ className, short, children }: TimestampProps) {
  let timestamp: string;
  const date = new Date(children);

  if (isToday(date)) {
    timestamp = format(date, "HH:mm");
  } else if (isYesterday(date)) {
    timestamp = "Yesterday";
  } else if (isThisWeek(date)) {
    timestamp = format(date, "E");
  } else if (isThisYear(date)) {
    timestamp = format(date, short ? "d LLL" : "d LLLL");
  } else {
    timestamp = format(date, short ? "LLL yyyy" : "d LLLL yyyy");
  }

  return <time className={className}>{timestamp}</time>;
}
