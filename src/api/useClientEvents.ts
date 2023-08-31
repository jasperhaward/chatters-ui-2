import { useEffect } from "preact/hooks";

import config from "@/config";
import { useSession } from "@/hooks";
import { ClientEvent, ErrorEvent } from "@/types";

export function useClientEvents(
  onEvent: (event: ClientEvent | ErrorEvent) => void
) {
  const [session] = useSession();

  useEffect(() => {
    const websocket = new WebSocket(`${config.websocketApiUrl}/api/v1/socket`);

    websocket.addEventListener("open", () => {
      const token = `Bearer ${session.token}`;
      websocket.send(token);
    });

    websocket.addEventListener("message", (event: MessageEvent<string>) => {
      onEvent(JSON.parse(event.data));
    });

    websocket.addEventListener("error", (event) => {
      const error: ErrorEvent = {
        error: {
          code: event.type,
          message: "Unknown connection error.",
        },
      };

      onEvent(error);
    });

    websocket.addEventListener("close", (event) => {
      const error: ErrorEvent = {
        error: {
          code: `${event.code}`,
          message: event.reason || "Connection closed unexpectedly.",
        },
      };

      onEvent(error);
    });
    return () => websocket.close();
  }, []);
}
