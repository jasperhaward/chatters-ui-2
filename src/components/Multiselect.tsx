import { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import styles from "./Multiselect.module.scss";

import { useInputs } from "@/hooks";
import { caseInsensitiveIncludes } from "@/utils";
import { Input, Icon, IconTuple, HighlightedText, Button } from ".";

export interface MultiselectOption {
  id: string;
  value: string;
  disabled?: boolean;
  icon?: IconTuple;
}

export interface MultiselectProps {
  placeholder: string;
  disabled: boolean;
  description: ComponentChildren;
  value: MultiselectOption[];
  options: MultiselectOption[];
  onAdd: (option: MultiselectOption) => void;
  onRemove: (option: MultiselectOption) => void;
}

export function Multiselect({
  placeholder,
  disabled,
  description,
  value,
  options,
  onRemove,
  ...props
}: MultiselectProps) {
  const [inputs, onInput, setInputs] = useInputs({ typeahead: "" });

  const filteredOptions = useMemo(() => {
    const valueIds = value.map((option) => option.id);

    return options
      .filter((option) => !valueIds.includes(option.id))
      .filter((option) =>
        caseInsensitiveIncludes(option.value, inputs.typeahead)
      );
  }, [value, options, inputs.typeahead]);

  function onAdd(option: MultiselectOption) {
    setInputs({ typeahead: "" });
    props.onAdd(option);
  }

  return (
    <>
      <div className={styles.typeahead}>
        <Input
          name="typeahead"
          autoComplete="off"
          placeholder={placeholder}
          disabled={disabled}
          value={inputs.typeahead}
          onInput={onInput}
        />
        <div className={styles.options}>
          {filteredOptions.length === 0 ? (
            <p className={styles.noOptions}>No results found</p>
          ) : (
            filteredOptions.map((option) => (
              <Button
                key={option.id}
                className={styles.option}
                color="ghost"
                disabled={disabled || option.disabled}
                onClick={() => onAdd(option)}
              >
                {option.icon && <Icon icon={option.icon} />}
                <HighlightedText query={inputs.typeahead}>
                  {option.value}
                </HighlightedText>
              </Button>
            ))
          )}
        </div>
      </div>
      {description}
      <div className={styles.values}>
        {value.map((option) => (
          <Button
            key={option.id}
            className={styles.pill}
            color="foreground"
            disabled={disabled || option.disabled}
            onClick={() => onRemove(option)}
          >
            {option.value}
            <Icon icon={["fas", "xmark"]} />
          </Button>
        ))}
      </div>
    </>
  );
}
