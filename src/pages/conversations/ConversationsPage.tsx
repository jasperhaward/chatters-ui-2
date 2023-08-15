import { useEffect } from "preact/hooks";
import styles from "./ConversationsPage.module.scss";

import { useLogout } from "../../api";
import { Spinner, FixedElement, Button, Card } from "../../components";
import { useSession, useInputs } from "../../hooks";
import { useAuthorizedFetch } from "../../api/useAuthorizedFetch";

import SearchBox from "./SearchBox";

const conversationInputs = {
  search: "",
  message: "",
};

export interface ChatProps {
  params: {
    id?: string;
  };
}

export default function ConversationsPage({ params }: ChatProps) {
  const [session, setSession] = useSession();

  const [inputs, onInput, setInputs] = useInputs(conversationInputs);
  const { isLoading, error, mutate } = useLogout();
  const fetch = useAuthorizedFetch();

  useEffect(() => {
    fetch("/api/v1/conversations", { method: "GET" });
  }, []);

  async function onLogoutClick() {
    const result = await mutate();

    if (!result.error) {
      setSession(null);
    }
  }

  function onSearcClearClick() {
    setInputs({ search: "" });
  }

  return (
    <div className={styles.conversations}>
      <FixedElement position="topRight">
        <Button color="ghost" disabled={isLoading} onClick={onLogoutClick}>
          {isLoading && <Spinner color="white" />}
          Logout
        </Button>
      </FixedElement>
      <Card className={styles.card}>
        <span className={styles.conversationsPanel}>
          <h2>Conversations</h2>
          <SearchBox
            name="search"
            value={inputs.search}
            disabled={isLoading}
            onInput={onInput}
            onClear={onSearcClearClick}
          />
          <div className={styles.messages}>{}</div>
          <Button>Create conversation</Button>
        </span>
        <span className={styles.messagesPanel}>Messages</span>
      </Card>
    </div>
  );
}
