import { useEffect, useMemo } from "preact/hooks";
import { useSession } from "@/features/auth";

export interface ErrorEvent {
  code: string;
  message: string;
}

interface UseAuthorizedWebSocketParams<T> {
  url: string;
  onEvent: (event: T) => void;
  onError: (event: ErrorEvent) => void;
}

export function useAuthorizedWebSocket<T>(
  params: UseAuthorizedWebSocketParams<T>
) {
  const [session] = useSession();

  const authedWebsocket = useMemo(() => {
    const websocket = new WebSocket(params.url);

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
  }, [params.onEvent]);

  function onMessage({ data }: MessageEvent<string>) {
    try {
      params.onEvent(JSON.parse(data));
    } catch (error) {
      console.error(error);
      onError(error);
    }
  }

  function onError(error: unknown) {
    params.onError({
      code: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : `${error}`,
    });
  }

  function onClose(event: CloseEvent) {
    params.onError({
      code: `${event.code}`,
      message: event.reason || "Connection closed unexpectedly.",
    });
  }

  function cleanup() {
    // when we close the connection ourselves make sure we don't trigger the onClose event
    // listener, we dont want to display the "Connection closed unexpectedly." toast
    authedWebsocket.removeEventListener("close", onClose);
    authedWebsocket.close();
  }

  return cleanup;
}
