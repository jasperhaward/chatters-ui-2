import { useEffect, useMemo } from "preact/hooks";

import config from "@/config";
import { Conversation, Message, UserWithCreatedAt } from "@/types";
import { useSession } from "@/features/auth";

export interface ConversationCreatedEvent {
  type: "conversation/created";
  payload: Conversation;
}

export interface MessageCreatedEvent {
  type: "message/created";
  payload: Message;
}

export interface RecipientAddedEvent {
  type: "recipient/added";
  payload: UserWithCreatedAt;
}

export interface RecipientRemovedEvent {
  type: "recipient/removed";
  payload: UserWithCreatedAt;
}

export interface ErrorEvent {
  type: "error";
  payload: {
    code: string;
    message: string;
  };
}

export type ServerEvent =
  | ConversationCreatedEvent
  | MessageCreatedEvent
  | RecipientAddedEvent
  | RecipientRemovedEvent
  | ErrorEvent;

export function useServerEvents(dispatch: (event: ServerEvent) => void) {
  const [session] = useSession();

  const authedWebsocket = useMemo(() => {
    const websocket = new WebSocket(`${config.websocketApiUrl}/api/v1/events`);

    // authenticate once WS connection is established
    websocket.addEventListener("open", () => {
      websocket.send(`Bearer ${session.token}`);
    });

    return websocket;
  }, []);

  useEffect(() => {
    authedWebsocket.addEventListener("message", onMessage);
    authedWebsocket.addEventListener("error", onError);
    authedWebsocket.addEventListener("close", onClose);

    return () => {
      authedWebsocket.removeEventListener("message", onMessage);
      authedWebsocket.removeEventListener("error", onError);
      authedWebsocket.removeEventListener("close", onClose);
    };
  }, [dispatch]);

  function onMessage(event: MessageEvent<string>) {
    try {
      const serverEvent: ServerEvent = JSON.parse(event.data);

      dispatch(serverEvent);
    } catch (error) {
      if (error instanceof SyntaxError) {
        dispatch({
          type: "error",
          payload: {
            code: "SyntaxError",
            message: "Server event is not valid JSON.",
          },
        });
      } else {
        throw error;
      }
    }
  }

  function onError(event: Event) {
    dispatch({
      type: "error",
      payload: {
        code: event.type,
        message: "Unknown connection error.",
      },
    });
  }

  function onClose(event: CloseEvent) {
    dispatch({
      type: "error",
      payload: {
        code: `${event.code}`,
        message: event.reason || "Connection closed unexpectedly.",
      },
    });
  }

  return () => {
    // when we close the connection ourselves make sure we don't trigger the onClose event
    // listener, we dont want to display the "Connection closed unexpectedly." toast
    authedWebsocket.removeEventListener("close", onClose);
    authedWebsocket.close();
  };
}
