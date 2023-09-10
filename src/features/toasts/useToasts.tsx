import { useContext } from "preact/hooks";
import { ToastContext } from ".";

export function useToasts() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      `useToasts() must be called from within <ToastProvider />.`
    );
  }

  return context;
}
