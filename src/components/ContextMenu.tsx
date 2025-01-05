import { ComponentChildren } from "preact";
import styles from "./ContextMenu.module.scss";

import { Popover, Icon, IconTuple, ButtonProps, Button } from ".";

export interface ContextMenuProps {
  icon?: IconTuple;
  children: ComponentChildren;
}

export function ContextMenu({
  icon = ["fas", "ellipsis-vertical"],
  children,
}: ContextMenuProps) {
  return (
    <Popover className={styles.contextMenu} content={children}>
      <Icon className={styles.icon} icon={icon} />
    </Popover>
  );
}

export interface ContextMenuSectionProps {
  children: ComponentChildren;
}

export function ContextMenuSection({ children }: ContextMenuSectionProps) {
  return <div className={styles.contextMenuSection}>{children}</div>;
}

export interface ContextMenuItemProps {
  className?: string;
  children: ComponentChildren;
}

export function ContextMenuItem({
  className = "",
  children,
}: ContextMenuItemProps) {
  return (
    <div className={`${className} ${styles.contextMenuItem}`}>{children}</div>
  );
}

export type ContextMenuButtonProps = Omit<ButtonProps, "color">;

export function ContextMenuButton({
  className = "",
  ...props
}: ContextMenuButtonProps) {
  return (
    <Button
      className={`${className} ${styles.contextMenuButton}`}
      color="ghost"
      {...props}
    />
  );
}
