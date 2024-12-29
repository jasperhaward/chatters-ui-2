import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";

import { ModalContext } from "./ModalContext";
import { ModalParameters } from "./types";
import Modal from "./Modal";

interface ModalProviderProps {
  children: ComponentChildren;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<ModalParameters | null>(null);

  function onClose() {
    setModal(null);
  }

  return (
    <ModalContext.Provider value={setModal}>
      {modal && (
        <Modal title={modal.title} onClose={onClose}>
          {modal.content(onClose)}
        </Modal>
      )}
      {children}
    </ModalContext.Provider>
  );
}
