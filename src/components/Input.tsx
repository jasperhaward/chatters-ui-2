import styles from "./Input.module.scss";

export interface InputProps {
  className?: string;
  placeholder?: string;
  type?: "text" | "password";
  autoComplete?: "off";
  name?: string;
  disabled?: boolean;
  value: string;
  onInput: (event: JSX.TargetedEvent<HTMLInputElement>) => void;
}

export function Input({
  className = "",
  placeholder,
  type,
  autoComplete,
  name,
  disabled,
  value,
  onInput,
}: InputProps) {
  return (
    <input
      className={`${styles.input} ${className}`}
      placeholder={placeholder}
      type={type}
      autoComplete={autoComplete}
      name={name}
      disabled={disabled}
      value={value}
      onInput={onInput}
    />
  );
}
