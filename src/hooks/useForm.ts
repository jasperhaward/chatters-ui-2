import { useMemo, useState } from "preact/hooks";
import { useInputs, OnInputEvent } from "./useInputs";

export type ValidationRules<T> = {
  [K in keyof T]: (value: T[K], inputs: T) => string | null;
};

export type ValidationErrors<T> = {
  [K in keyof T]: string | null;
};

export interface UseForm<T> {
  inputs: T;
  hasErrors: boolean;
  errors: ValidationErrors<T>;
  hasSubmitted: boolean;
  onInput: (event: OnInputEvent) => void;
  setInputs: (updatedInputs: Partial<T>) => void;
  setHasSubmitted: (value: boolean) => void;
}

export function useForm<T>(
  initialInputs: T,
  validation: ValidationRules<T>
): UseForm<T> {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [inputs, onInput, setInputs] = useInputs(initialInputs);

  const errors = useMemo(() => {
    const errors: Partial<ValidationErrors<T>> = {};

    for (const key in validation) {
      const rule = validation[key];
      errors[key] = rule(inputs[key], inputs);
    }

    return errors as ValidationErrors<T>;
  }, [inputs, validation]);

  return {
    inputs,
    hasErrors: Object.values(errors).some((value) => value !== null),
    errors,
    hasSubmitted,
    onInput,
    setInputs,
    setHasSubmitted,
  };
}
