import { useMemo } from "preact/hooks";
import styles from "./Typeahead.module.scss";

import { caseInsensitiveIncludes } from "@/utils";
import { Input, Icon, IconTuple, HighlightedText } from ".";

export interface TypeaheadOption {
  id: string;
  value: string;
  icon?: IconTuple;
}

export interface TypeaheadProps {
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  value: string;
  options: TypeaheadOption[];
  onInput: (event: JSX.TargetedEvent<HTMLInputElement>) => void;
  onSelect: (option: TypeaheadOption) => void;
}

export function Typeahead({
  placeholder,
  name,
  disabled,
  value,
  options,
  onInput,
  onSelect,
}: TypeaheadProps) {
  const filteredOptions = useMemo(() => {
    // include options where the option's value includes the input value,
    // then sort by value alphabetically
    return options
      .filter((option) => caseInsensitiveIncludes(option.value, value))
      .sort((a, b) => (a.value > b.value ? 1 : -1));
  }, [value, options]);

  return (
    <div className={styles.typeahead}>
      <Input
        name={name}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onInput={onInput}
      />
      <div className={styles.options}>
        {filteredOptions.length === 0 ? (
          <div className={styles.noOptions}>No results found.</div>
        ) : (
          filteredOptions.map((option) => (
            <button
              key={option.id}
              className={styles.option}
              onClick={() => onSelect(option)}
            >
              {option.icon && <Icon icon={option.icon} />}
              <HighlightedText query={value}>{option.value}</HighlightedText>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
