import { useContext } from "preact/hooks";
import { ModalContext } from ".";

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error(`useModal() must be called from within <ModalProvider />.`);
  }

  return context;
}
