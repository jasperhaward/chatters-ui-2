import styles from "./UserMenu.module.scss";

import {
  Button,
  ContextMenu,
  ContextMenuButton,
  ContextMenuItem,
  ContextMenuSection,
  FixedElement,
  Icon,
  IconButton,
} from "@/components";
import { useLogout } from "@/api";
import { useIsMobile } from "@/hooks";
import { useToasts } from "@/features/toasts";
import { useSession } from "@/features/auth";
import { useTheme } from "@/features/theme";

export function UserMenu() {
  const isMobile = useIsMobile();
  const [session, setSession] = useSession();
  const [toast] = useToasts();
  const [theme, setTheme] = useTheme();
  const logout = useLogout();

  function onToggleThemeClick() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  async function onLogoutClick() {
    const result = await logout.execute();

    if (result.error) {
      toast({
        title: "Failed to logout, please try again.",
        description: result.error.message,
      });
    } else {
      setSession(null);
    }
  }

  if (isMobile) {
    return (
      <ContextMenu icon={["fas", "user-pen"]}>
        <ContextMenuItem>
          <Icon className={styles.icon} icon={["fas", "user"]} />
          <h4>{session.user.username}</h4>
        </ContextMenuItem>
        <ContextMenuSection>
          <ContextMenuButton color="ghost" onClick={onToggleThemeClick}>
            Toggle Theme
            <Icon icon={["fas", "circle-half-stroke"]} />
          </ContextMenuButton>
          <ContextMenuButton
            color="ghost"
            disabled={logout.isLoading}
            spinner={logout.isLoading}
            onClick={onLogoutClick}
          >
            Logout
          </ContextMenuButton>
        </ContextMenuSection>
      </ContextMenu>
    );
  }

  return (
    <FixedElement position="topRight">
      <IconButton
        icon={["fas", "circle-half-stroke"]}
        onClick={onToggleThemeClick}
      />
      <span className={styles.username}>{session.user.username}</span>
      <Button
        color="ghost"
        disabled={logout.isLoading}
        spinner={logout.isLoading}
        onClick={onLogoutClick}
      >
        Logout
      </Button>
    </FixedElement>
  );
}
