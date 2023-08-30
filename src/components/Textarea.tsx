import { useEffect, useRef } from "preact/hooks";
import styles from "./Textarea.module.scss";

export interface TextareaProps {
  className?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  maxHeight: number;
  value: string;
  onInput: (event: JSX.TargetedEvent<HTMLTextAreaElement>) => void;
  onEnterPress?: () => void;
}

export function Textarea({
  className = "",
  name,
  placeholder,
  disabled,
  maxHeight,
  value,
  onEnterPress,
  ...props
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current && value === "") {
      ref.current.style.height = "";
    }
  }, [value]);

  function onInput(event: JSX.TargetedEvent<HTMLTextAreaElement>) {
    const textarea = ref.current!;

    // scrollHeight does not include border width, we must add it manually
    const borderHeight = textarea.offsetHeight - textarea.clientHeight;

    if (textarea.scrollHeight + borderHeight <= maxHeight) {
      textarea.style.height = "";
      textarea.style.height = `${textarea.scrollHeight + borderHeight}px`;
    }

    props.onInput(event);
  }

  function onKeyPress(event: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>) {
    if (onEnterPress && !event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      onEnterPress();
    }
  }

  return (
    <textarea
      ref={ref}
      className={`${styles.textarea} ${className}`}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onInput={onInput}
      onKeyPress={onKeyPress}
    />
  );
}
