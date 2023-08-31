import { useContext } from "preact/hooks";
import { SessionContext } from "@/context";
import { Session } from "@/types";

export type UseSession = [
  session: Session,
  setSession: (value: Session | null) => void
];

export function useSession(): UseSession {
  const [session, setSession] = useContext(SessionContext);

  if (!session) {
    throw new Error(
      `useSession() must be called from within <SessionContext.Provider />.`
    );
  }

  return [session, setSession];
}
