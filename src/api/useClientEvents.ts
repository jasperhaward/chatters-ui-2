import { useEffect } from "preact/hooks";

import config from "@/config";
import { useSession } from "@/hooks";
import { ClientEvent } from "@/types";

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

    return () => websocket.close();
  }, []);
}
