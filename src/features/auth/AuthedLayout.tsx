import { ComponentChildren } from "preact";
import styles from "./AuthedLayout.module.scss";

import { Button, FixedElement, IconButton } from "@/components";
import { useLogout } from "@/api";
import { useToasts } from "@/features/toasts";
import { useSession } from "@/features/auth";
import { useTheme } from "@/features/theme";

interface AuthedLayoutProps {
  children: ComponentChildren;
}

export function AuthedLayout({ children }: AuthedLayoutProps) {
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

  return (
    <>
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
      {children}
    </>
  );
}
