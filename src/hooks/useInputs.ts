import { useReducer } from "preact/hooks";

export type Inputs = {
  [key: string]: string | boolean;
};

export type OnInputEvent = JSX.TargetedEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

export type UseInputs<T> = [
  inputs: T,
  onInput: (event: OnInputEvent) => void,
  setInputs: (updatedInputs: Partial<T>) => void
];

export function useInputs<T>(initialInputs: T): UseInputs<T> {
  const [inputs, setInputs] = useReducer(
    (inputs: T, updatedInputs: Partial<T>) => ({
      ...inputs,
      ...updatedInputs,
    }),
    initialInputs
  );

  function onInput(event: OnInputEvent) {
    const { name, value, checked, type } =
      event.currentTarget as HTMLInputElement;

    if (type === "checkbox") {
      setInputs({ [name]: checked } as Partial<T>);
    } else {
      setInputs({ [name]: value } as Partial<T>);
    }
  }

  return [inputs, onInput, setInputs];
}
