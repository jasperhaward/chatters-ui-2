import { Button, InputGroup, Icon, Textarea, Spinner } from "@/components";

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
        disabled={disabled || isLoading}
        value={value}
        onInput={onInput}
        onEnterPress={onEnterPress}
      />
      <Button
        color="ghost"
        disabled={disabled || !isValueValid}
        onClick={onSubmit}
      >
        {isLoading ? (
          <Spinner color="foreground" />
        ) : (
          <Icon icon={["fas", "paper-plane"]} />
        )}
      </Button>
    </InputGroup>
  );
}
