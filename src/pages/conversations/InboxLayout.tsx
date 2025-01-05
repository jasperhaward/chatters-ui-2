import { ComponentChildren } from "preact";
import styles from "./InboxLayout.module.scss";

import { useIsMobile } from "@/hooks";
import { Card } from "@/components";

interface InboxLayoutProps {
  isDisplayRhs: boolean;
  lhs: ComponentChildren;
  rhs: ComponentChildren;
}

export default function InboxLayout({
  isDisplayRhs,
  lhs,
  rhs,
}: InboxLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={styles.mobileLayout}>{isDisplayRhs ? rhs : lhs}</div>
    );
  }

  return (
    <div className={styles.desktopLayout}>
      <Card>
        <span className={styles.lhs}>{lhs}</span>
        <span className={styles.rhs}>{rhs}</span>
      </Card>
    </div>
  );
}
