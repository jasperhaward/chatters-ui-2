import { createContext } from "preact";
import { ToastParameters } from "./types";

export type TToastContext = [
  displayToast: (toast: ToastParameters) => void,
  clearToasts: () => void
];

export const ToastContext = createContext<TToastContext | null>(null);
