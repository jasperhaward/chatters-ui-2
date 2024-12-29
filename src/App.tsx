import { Redirect, Route, Switch, useLocation } from "wouter-preact";
import styles from "./App.module.scss";

import { Icon, FixedElement } from "./components";
import { useLocalStorage } from "./hooks";
import {
  Session,
  SessionContext,
  AuthedRoute,
  AuthedLayout,
} from "./features/auth";
import { ToastProvider } from "./features/toasts";
import { ThemeProvider } from "./features/theme";

import ConversationsPage from "./pages/conversations/ConversationsPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";

export const paths = {
  index: "/",
  login: "/login",
  conversations: "/conversations",
} as const;

function App() {
  const [location] = useLocation();
  const [session, setSession] = useLocalStorage<Session | null>(
    "session",
    null
  );

  if (location === paths.login && session) {
    return <Redirect to={paths.conversations} />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <SessionContext.Provider value={[session, setSession]}>
          <FixedElement position="topLeft">
            <h2 className={styles.brand}>
              <Icon icon={["fas", "terminal"]} />
              Chatters
            </h2>
          </FixedElement>
          <Switch>
            <Route path={paths.index}>
              <RegisterPage />
            </Route>
            <Route path={paths.login}>
              <LoginPage />
            </Route>
            <AuthedRoute path={`${paths.conversations}/:conversationId?`}>
              {(params) => (
                <AuthedLayout>
                  <ConversationsPage conversationId={params.conversationId} />
                </AuthedLayout>
              )}
            </AuthedRoute>
          </Switch>
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
        </SessionContext.Provider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
