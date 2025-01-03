import { Redirect, Route, Switch, useLocation } from "wouter-preact";
import styles from "./App.module.scss";

import { Icon, FixedElement } from "./components";
import { useIsMobile, useLocalStorage } from "./hooks";
import { Session, SessionContext, AuthedRoute } from "./features/auth";
import { ToastProvider } from "./features/toasts";
import { ThemeProvider } from "./features/theme";
import { ModalProvider } from "./features/modal";

import ConversationsPage from "./pages/conversations/ConversationsPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";

export const paths = {
  index: "/",
  login: "/login",
  conversations: "/conversations",
} as const;

function App() {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const [session, setSession] = useLocalStorage<Session | null>(
    "session",
    null
  );

  const isDisplayBranding =
    !location.includes(paths.conversations) || !isMobile;

  if (location === paths.login && session) {
    return <Redirect to={paths.conversations} />;
  }

  return (
    <SessionContext.Provider value={[session, setSession]}>
      <ThemeProvider>
        <ToastProvider>
          <ModalProvider>
            {isDisplayBranding && (
              <FixedElement position="topLeft">
                <h2 className={styles.brand}>
                  <Icon icon={["fas", "terminal"]} />
                  Chatters
                </h2>
              </FixedElement>
            )}
            <Switch>
              <Route path={paths.index}>
                <RegisterPage />
              </Route>
              <Route path={paths.login}>
                <LoginPage />
              </Route>
              <AuthedRoute path={`${paths.conversations}/:conversationId?`}>
                {(params) => (
                  <ConversationsPage conversationId={params.conversationId} />
                )}
              </AuthedRoute>
            </Switch>
            {isDisplayBranding && (
              <FixedElement position="bottomLeft">
                <footer className={styles.footer}>
                  Built with Preact, TypeScript & SASS. Source code on
                  <a
                    target="_blank"
                    href="https://github.com/jasperhaward/chatters-ui"
                  >
                    GitHub
                  </a>
                  .
                </footer>
              </FixedElement>
            )}
          </ModalProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionContext.Provider>
  );
}

export default App;
