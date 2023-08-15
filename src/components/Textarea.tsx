import { useRef } from "preact/hooks";
import styles from "./Textarea.module.scss";

export interface TextareaProps {
  className?: string;
  placeholder?: string;
  value: string;
  maxHeight: number;
  validate?: (value: string) => boolean;
  onEnterPress?: () => void | Promise<void>;
  onInput: (event: JSX.TargetedEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  className = "",
  placeholder,
  value,
  maxHeight,
  validate,
  onEnterPress,
  onInput,
}: TextareaProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);

  function onInputWithResize(event: JSX.TargetedEvent<HTMLTextAreaElement>) {
    const textareaElement = textarea.current!;

    if (textareaElement.scrollHeight <= maxHeight) {
      textareaElement.style.height = "inherit";
      textareaElement.style.height = `${textareaElement.scrollHeight}px`;
    }

    onInput(event);
  }

  /**
   * Handle enter being pressed. Resets the textarea height after onEnter has been called.
   */
  async function onKeyPress(
    event: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>
  ) {
    if (!event.shiftKey && event.key === "Enter" && onEnterPress) {
      if (validate && !validate(event.currentTarget.value)) {
        return;
      }

      await onEnterPress();

      textarea.current!.style.height = "inherit";
    }
  }

  return (
    <textarea
      ref={textarea}
      className={`${styles.textarea} ${className}`}
      placeholder={placeholder}
      value={value}
      onInput={onInputWithResize}
      onKeyPress={onKeyPress}
    />
  );
}
