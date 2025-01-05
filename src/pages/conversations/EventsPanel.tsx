import EventsPane, { EventsPaneProps } from "./events-pane/EventsPane";
import MessageBox from "./MessageBox";
import ConversationHeader, {
  ConversationHeaderProps,
} from "./ConversationHeader";

interface EventsPanelProps extends ConversationHeaderProps, EventsPaneProps {
  disabled: boolean;
  message: string;
  isMessageLoading: boolean;
  onInput: (value: JSX.TargetedEvent<HTMLTextAreaElement>) => void;
  onMessageCreationSubmit: () => void;
}

export default function EventsPanel({
  disabled,
  message,
  selectedConversation,
  isMessageLoading,
  events,
  contacts,
  onInput,
  onMessageCreationSubmit,
}: EventsPanelProps) {
  return (
    <>
      <ConversationHeader
        selectedConversation={selectedConversation}
        contacts={contacts}
      />
      <EventsPane events={events} />
      <MessageBox
        name="message"
        isLoading={isMessageLoading}
        disabled={disabled}
        value={message}
        onInput={onInput}
        onSubmit={onMessageCreationSubmit}
      />
    </>
  );
}
