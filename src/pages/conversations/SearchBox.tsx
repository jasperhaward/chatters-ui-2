import { InputGroup, IconButton, Input } from "@/components";

export interface SearchBoxProps {
  name: string;
  value: string;
  disabled: boolean;
  onInput: (value: JSX.TargetedEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function SearchBox({
  name,
  value,
  disabled,
  onInput,
  onClear,
}: SearchBoxProps) {
  return (
    <InputGroup>
      <Input
        name={name}
        placeholder="Search"
        autoComplete="off"
        value={value}
        disabled={disabled}
        onInput={onInput}
      />
      {value !== "" && (
        <IconButton
          icon={["fas", "times"]}
          disabled={disabled}
          onClick={onClear}
        />
      )}
    </InputGroup>
  );
}
