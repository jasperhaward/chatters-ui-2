import { InputGroup, Button, Input, Icon } from "@/components";

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
        <Button color="ghost" disabled={disabled} onClick={onClear}>
          <Icon icon={["fas", "times"]} />
        </Button>
      )}
    </InputGroup>
  );
}
