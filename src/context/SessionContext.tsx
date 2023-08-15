import { createContext } from "preact";
import type { Session } from "../types";

export type TSessionContext = [
  session: Session | null,
  setSession: (session: Session | null) => void,
];

export const SessionContext = createContext<TSessionContext>([
  null,
  () => null,
]);
