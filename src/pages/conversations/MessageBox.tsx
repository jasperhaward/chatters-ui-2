import styles from "./MessageBox.module.scss";
import { IconButton, InputGroup, Textarea, Spinner } from "@/components";

interface MessageBoxProps {
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
        <Spinner className={styles.spinner} color="grey" />
      ) : (
        <IconButton
          icon={["fas", "arrow-right"]}
          disabled={disabled || !isValueValid}
          onClick={onSubmit}
        />
      )}
    </InputGroup>
  );
}
