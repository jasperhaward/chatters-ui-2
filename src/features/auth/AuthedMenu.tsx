import styles from "./AuthedMenu.module.scss";

import { Button, FixedElement, Icon, IconButton, Popover } from "@/components";
import { useLogout } from "@/api";
import { useIsMobile } from "@/hooks";
import { useToasts } from "@/features/toasts";
import { useSession } from "@/features/auth";
import { useTheme } from "@/features/theme";

export function AuthedMenu() {
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
      <FixedElement position="topRight">
        <Popover
          content={
            <>
              <div>{session.user.username}</div>
              <Button color="ghost" onClick={onToggleThemeClick}>
                Toggle Theme
              </Button>
              <Button
                color="ghost"
                disabled={logout.isLoading}
                spinner={logout.isLoading}
                onClick={onLogoutClick}
              >
                Logout
              </Button>
            </>
          }
        >
          <Icon
            className={styles.ellipsis}
            icon={["fas", "ellipsis-vertical"]}
          />
        </Popover>
      </FixedElement>
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
