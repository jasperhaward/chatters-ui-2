import styles from "./ConversationsPanel.module.scss";
import { Button } from "@/components";
import { UserMenu } from "@/features/auth";

import SearchBox from "./SearchBox";
import ConversationsPane, {
  ConversationsPaneProps,
} from "./conversations-pane/ConversationsPane";

interface ConversationsPanel extends ConversationsPaneProps {
  onInput: (value: JSX.TargetedEvent<HTMLInputElement>) => void;
  onSearchClearClick: () => void;
  onCreateConversationClick: () => void;
}

export default function ConversationsPanel({
  search,
  selectedConversation,
  conversations,
  onInput,
  onSearchClearClick,
  onConversationClick,
  onCreateConversationClick,
}: ConversationsPanel) {
  const disabled = conversations.isLoading || !!conversations.error;

  return (
    <>
      <div className={styles.heading}>
        <h2>Conversations</h2>
        <UserMenu />
      </div>
      <SearchBox
        name="search"
        disabled={disabled}
        value={search}
        onInput={onInput}
        onClear={onSearchClearClick}
      />
      <ConversationsPane
        search={search}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onConversationClick={onConversationClick}
      />
      <Button
        color="foreground"
        disabled={disabled}
        onClick={onCreateConversationClick}
      >
        Create conversation
      </Button>
    </>
  );
}
