import styles from "./ErrorMessage.module.scss";

export interface ErrorMessageProps {
  className?: string;
  children: string;
}

export function ErrorMessage({ className = "", children }: ErrorMessageProps) {
  return (
    <div className={`${styles.errorMessage} ${className}`}>{children}</div>
  );
}
