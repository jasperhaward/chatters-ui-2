import {
  IconPrefix,
  IconName,
  icon as factory,
} from "@fortawesome/fontawesome-svg-core";
import styles from "./Icon.module.scss";

export type IconTuple = [IconPrefix, IconName];

export interface IconProps {
  className?: string;
  icon: IconTuple;
}

export function Icon({ className = "", icon: [prefix, iconName] }: IconProps) {
  const icon = factory({ prefix, iconName });

  if (!icon) {
    throw new Error(`Icon '${prefix}' - '${iconName}' not in library.`);
  }

  const [element] = icon.abstract;

  return (
    <svg
      className={`${styles.icon} ${element.attributes.class} ${className}`}
      {...element.attributes}
    >
      {element.children!.map((child, index) => (
        <path key={index} {...child.attributes} />
      ))}
    </svg>
  );
}
