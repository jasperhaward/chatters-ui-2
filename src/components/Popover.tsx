import { ComponentChildren } from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import styles from "./Popover.module.scss";

interface PopoverPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface PopoverProps {
  content: ComponentChildren;
  children: ComponentChildren;
}

export function Popover({ content, children }: PopoverProps) {
  const container = useRef<HTMLSpanElement>(null);
  const popover = useRef<HTMLDivElement>(null);
  const [isDisplay, setIsDisplay] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>();

  useEffect(() => {
    window.addEventListener("scroll", onHidePopover, true);

    return () => window.addEventListener("scroll", onHidePopover, true);
  }, []);

  useLayoutEffect(() => {
    if (isDisplay && container.current && popover.current) {
      // visualViewport contains the correct dimensions for mobile devices
      const viewportWidth = visualViewport?.width || window.innerWidth;
      const containerRect = container.current.getBoundingClientRect();
      const popoverRect = popover.current.getBoundingClientRect();

      let top, right, bottom, left;

      if (popoverRect.right > viewportWidth) {
        right = viewportWidth - containerRect.right;
      } else {
        left =
          containerRect.left + containerRect.width / 2 - popoverRect.width / 2;
      }

      if (containerRect.bottom + popoverRect.height > window.innerHeight) {
        bottom = window.innerHeight - containerRect.top;
      } else {
        top = containerRect.bottom;
      }

      setPosition({ top, left, bottom, right });
    }
  }, [isDisplay]);

  function onDisplayPopover() {
    setIsDisplay(true);
  }

  function onHidePopover() {
    setPosition(undefined);
    setIsDisplay(false);
  }

  return (
    <span
      ref={container}
      onMouseOver={onDisplayPopover}
      onMouseLeave={onHidePopover}
    >
      {isDisplay && (
        <div
          ref={popover}
          className={styles.popover}
          style={convertPropertiesToString(position)}
        >
          <div className={styles.popoverContent}>{content}</div>
        </div>
      )}
      {children}
    </span>
  );
}

function convertPropertiesToString(position: PopoverPosition | undefined) {
  if (!position) {
    return;
  }

  return {
    top: position.top ? `${position.top}px` : undefined,
    right: position.right ? `${position.right}px` : undefined,
    bottom: position.bottom ? `${position.bottom}px` : undefined,
    left: position.left ? `${position.left}px` : undefined,
  };
}
