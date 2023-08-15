import { Input, Icon } from "../../components";

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
    <div>
      <Input
        name={name}
        placeholder="Search"
        autoComplete="off"
        value={value}
        disabled={disabled}
        onInput={onInput}
      />
      {value === "" ? (
        <Icon icon={["fas", "search"]} />
      ) : (
        <Icon icon={["fas", "times"]} />
      )}
    </div>
  );
}
