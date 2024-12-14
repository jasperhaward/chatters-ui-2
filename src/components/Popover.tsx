import { ComponentChildren } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import styles from "./Popover.module.scss";

type PopoverPosition =
  | { top: number; left: number }
  | { bottom: number; left: number };

export interface PopoverProps {
  content: ComponentChildren;
  children: ComponentChildren;
}

export function Popover({ content, children }: PopoverProps) {
  const container = useRef<HTMLSpanElement>(null);
  const popover = useRef<HTMLDivElement>(null);
  const [isDisplay, setIsDisplay] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>();

  useLayoutEffect(() => {
    if (isDisplay && container.current && popover.current) {
      const containerRect = container.current.getBoundingClientRect();
      const popoverHeight = popover.current.offsetHeight;
      const popoverWidth = popover.current.offsetWidth;

      const left =
        containerRect.left + containerRect.width / 2 - popoverWidth / 2;

      if (containerRect.bottom + popoverHeight > window.innerHeight) {
        setPosition({ bottom: window.innerHeight - containerRect.top, left });
      } else {
        setPosition({ top: containerRect.bottom, left });
      }
    }
  }, [isDisplay]);

  return (
    <span
      ref={container}
      onMouseOver={() => setIsDisplay(true)}
      onMouseLeave={() => setIsDisplay(false)}
    >
      {isDisplay && (
        <div ref={popover} className={styles.popover} style={position}>
          <div className={styles.popoverContent}>{content}</div>
        </div>
      )}
      {children}
    </span>
  );
}
