import { Redirect, Route, Switch, useLocation } from "wouter";
import styles from "./App.module.scss";

import { Icon, FixedElement } from "./components";
import { useLocalStorage } from "./hooks";
import { Session, SessionContext, AuthedRoute } from "./features/auth";
import { ToastProvider } from "./features/toasts";

import ConversationsPage from "./pages/conversations/ConversationsPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";

export const paths = {
  index: "/",
  login: "/login",
  conversations: "/conversations",
} as const;

function App() {
  const [session, setSession] = useLocalStorage<Session>("session");
  const [location] = useLocation();

  if (location === paths.login && session) {
    return <Redirect to={paths.conversations} />;
  }

  return (
    <SessionContext.Provider value={[session, setSession]}>
      <ToastProvider>
        <FixedElement position="topLeft">
          <h2 className={styles.brand}>
            <Icon icon={["fas", "terminal"]} />
            Chatters
          </h2>
        </FixedElement>
        <FixedElement position="bottomLeft">
          <span className={styles.footer}>
            Built with Preact, TypeScript & SASS. Source code is available on{" "}
            <a
              target="_blank"
              href="https://github.com/jasperhaward/chatters-ui"
            >
              GitHub
            </a>
            .
          </span>
        </FixedElement>
        <Switch>
          <Route path={paths.index} component={RegisterPage} />
          <Route path={paths.login} component={LoginPage} />
          <AuthedRoute
            path={paths.conversations}
            component={ConversationsPage}
          />
          <AuthedRoute
            path={`${paths.conversations}/:conversationId`}
            component={ConversationsPage}
          />
        </Switch>
      </ToastProvider>
    </SessionContext.Provider>
  );
}

export default App;
