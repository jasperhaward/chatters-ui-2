import { IconButton, InputGroup, Textarea, Spinner } from "@/components";

export interface MessageBoxProps {
  isLoading: boolean;
  name: string;
  value: string;
  disabled: boolean;
  onInput: (value: JSX.TargetedEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

export default function MessageBox({
  isLoading,
  name,
  value,
  disabled,
  onInput,
  onSubmit,
}: MessageBoxProps) {
  const isValueValid = value !== "";

  function onEnterPress() {
    if (isValueValid) {
      onSubmit();
    }
  }

  return (
    <InputGroup>
      <Textarea
        name={name}
        placeholder="Type a message..."
        maxHeight={175}
        disabled={disabled}
        value={value}
        onInput={onInput}
        onEnterPress={onEnterPress}
      />
      {isLoading ? (
        <Spinner color="grey" margin="enabled" />
      ) : (
        <IconButton
          icon={["fas", "paper-plane"]}
          disabled={disabled || !isValueValid}
          onClick={onSubmit}
        />
      )}
    </InputGroup>
  );
}
