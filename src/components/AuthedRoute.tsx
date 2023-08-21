import { useContext } from "preact/hooks";
import { Route, RouteProps, Redirect } from "wouter";

import { paths } from "@/App";
import { SessionContext } from "@/context";

export function AuthedRoute(props: RouteProps) {
  const [session] = useContext(SessionContext);

  if (!session) {
    return <Redirect to={paths.login} />;
  }

  return <Route {...props} />;
}
