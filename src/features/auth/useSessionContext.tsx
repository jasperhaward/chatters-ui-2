import { useContext } from "preact/hooks";
import { SessionContext, TSessionContext } from ".";

/**
 * Retrieves `SessionContext` or throws an error if it has not been initialised.
 */
export function useSessionContext(): TSessionContext {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      `useSessionContext() must be called from within <SessionContext.Provider />.`
    );
  }

  return context;
}
