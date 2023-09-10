import { Route, RouteProps, Redirect } from "wouter";

import { paths } from "@/App";
import { useSessionContext } from ".";

export function AuthedRoute(props: RouteProps) {
  const [session] = useSessionContext();

  if (!session) {
    return <Redirect to={paths.login} />;
  }

  return <Route {...props} />;
}
