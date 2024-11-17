import { HighlightedText } from "@/components";
import { useSession } from "@/features/auth";
import { Conversation } from "@/types";

interface ConversationTitleProps {
  className?: string;
  query?: string;
  conversation: Conversation;
}

export default function ConversationTitle({
  className,
  query,
  conversation,
}: ConversationTitleProps) {
  const [session] = useSession();
  const title = buildTitle(conversation, session.user.id);

  if (query) {
    return (
      <HighlightedText className={className} query={query}>
        {title}
      </HighlightedText>
    );
  }

  return <span className={className}>{title}</span>;
}

function buildTitle(conversation: Conversation, userId: string) {
  if (conversation.title) {
    return conversation.title;
  }

  return conversation.recipients
    .filter((recipient) => recipient.id !== userId)
    .map((recipient) => recipient.username)
    .join(", ");
}
