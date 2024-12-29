import { ComponentChildren } from "preact";

export interface ModalParameters {
  title: string;
  content: (onClose: () => void) => ComponentChildren;
}
