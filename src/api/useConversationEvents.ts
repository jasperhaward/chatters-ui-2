import { WebSocketConversationEvent } from "@/types";
import config from "@/config";
import { useToasts } from "@/features/toasts";
import { ErrorEvent, useAuthorizedWebSocket } from "./useAuthorizedWebSocket";

export function useConversationEvents(
  onConversationEvent: (event: WebSocketConversationEvent) => void
) {
  const [toast] = useToasts();
  const disconnectWebsocket =
    useAuthorizedWebSocket<WebSocketConversationEvent>({
      url: `${config.websocketApiUrl}/api/v1/events`,
      onEvent: onConversationEvent,
      onError,
    });

  function onError(event: ErrorEvent) {
    toast({
      permanent: true,
      title: "Failed to subscribe to updates, please refresh the page.",
      description: event.message,
    });
  }

  return disconnectWebsocket;
}
