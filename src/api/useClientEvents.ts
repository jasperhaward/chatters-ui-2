import { useEffect } from "preact/hooks";

import config from "@/config";
import { ClientEvent, ErrorEvent } from "@/types";
import { useSession } from "@/features/auth";

export function useClientEvents(
  onEvent: (event: ClientEvent | ErrorEvent) => void
) {
  const [session] = useSession();

  useEffect(() => {
    const websocket = new WebSocket(`${config.websocketApiUrl}/api/v1/socket`);

    function onOpen() {
      const token = `Bearer ${session.token}`;
      websocket.send(token);
    }

    function onMessage(event: MessageEvent<string>) {
      onEvent(JSON.parse(event.data));
    }

    function onError(event: Event) {
      const error: ErrorEvent = {
        error: {
          code: event.type,
          message: "Unknown connection error.",
        },
      };

      onEvent(error);
    }

    function onClose(event: CloseEvent) {
      const error: ErrorEvent = {
        error: {
          code: `${event.code}`,
          message: event.reason || "Connection closed unexpectedly.",
        },
      };

      onEvent(error);
    }

    websocket.addEventListener("open", onOpen);
    websocket.addEventListener("message", onMessage);
    websocket.addEventListener("error", onError);
    websocket.addEventListener("close", onClose);

    return () => {
      websocket.removeEventListener("close", onClose);
      websocket.close();
    };
  }, []);
}
