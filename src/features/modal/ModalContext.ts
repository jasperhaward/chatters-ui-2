import { createContext } from "preact";
import { ModalParameters } from "./types";

type UseModalCallback = (params: ModalParameters) => void;

export const ModalContext = createContext<UseModalCallback | null>(null);
