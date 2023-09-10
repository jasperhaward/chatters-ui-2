import { useMemo } from "preact/hooks";

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

  const websocket = useMemo(() => {
    const websocket = new WebSocket(`${config.websocketApiUrl}/api/v1/socket`);

    // authenticate once WS connection is established
    websocket.addEventListener("open", () => {
      websocket.send(`Bearer ${session.token}`);
    });

    websocket.addEventListener("message", (event) => {
      try {
        const serverEvent: ServerEvent = JSON.parse(`${event.data}`);
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
    });

    websocket.addEventListener("error", (event) => {
      dispatch({
        type: "error",
        payload: {
          code: event.type,
          message: "Unknown connection error.",
        },
      });
    });

    websocket.addEventListener("close", onClose);

    return websocket;
  }, []);

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
    websocket.removeEventListener("close", onClose);
    websocket.close();
  };
}
