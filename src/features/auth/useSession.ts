import { Session, useSessionContext } from ".";

export type UseSession = [
  session: Session,
  setSession: (value: Session | null) => void
];

/**
 * Retrieves the user `Session` or throws an error if it is `null`.
 * Should only be called from inside of an `<AuthedRoute />` where
 * the user is guaranteed to have an active `Session`.
 */
export function useSession(): UseSession {
  const [session, setSession] = useSessionContext();

  if (!session) {
    throw new Error(
      `useSession() must be called from within an <AuthedRoute />.`
    );
  }

  return [session, setSession];
}
