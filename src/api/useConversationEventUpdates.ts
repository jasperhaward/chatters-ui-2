import { useEffect, useMemo } from "preact/hooks";

import config from "@/config";
import { UiConversationEvent } from "@/types";
import { useSession } from "@/features/auth";

export interface ErrorEvent {
  code: string;
  message: string;
}

interface UseConversationEventUpdatesCallbacks {
  onEvent: (event: UiConversationEvent) => void;
  onError: (event: ErrorEvent) => void;
}

export function useConversationEventUpdates(
  callbacks: UseConversationEventUpdatesCallbacks
) {
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
  }, [callbacks.onEvent]);

  function onMessage(rawEvent: MessageEvent<string>) {
    try {
      const event: UiConversationEvent = JSON.parse(rawEvent.data);

      callbacks.onEvent(event);
    } catch (error) {
      console.error(error);
      onError(error);
    }
  }

  function onError(error: unknown) {
    callbacks.onError({
      code: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : `${error}`,
    });
  }

  function onClose(event: CloseEvent) {
    callbacks.onError({
      code: `${event.code}`,
      message: event.reason || "Connection closed unexpectedly.",
    });
  }

  return () => {
    // when we close the connection ourselves make sure we don't trigger the onClose event
    // listener, we dont want to display the "Connection closed unexpectedly." toast
    authedWebsocket.removeEventListener("close", onClose);
    authedWebsocket.close();
  };
}
