import { createElement } from "preact";
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

  if (icon) {
    const [element] = icon.abstract;

    const children = element.children!.map((child) =>
      createElement(child.tag, child.attributes)
    );

    const elementProps = {
      ...element.attributes,
      class: `${styles.icon} ${className} ${element.attributes.class}`,
    };

    return createElement(element.tag, elementProps, children);
  } else {
    throw new Error(`Icon '${prefix}' - '${iconName}' not in library.`);
  }
}
