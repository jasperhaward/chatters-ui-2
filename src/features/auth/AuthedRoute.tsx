import {
  Route,
  RouteProps,
  Redirect,
  DefaultParams,
  PathPattern,
} from "wouter-preact";

import { paths } from "@/App";
import { useSessionContext } from ".";

export function AuthedRoute<
  T extends DefaultParams | undefined,
  RoutePath extends PathPattern = PathPattern
>(props: RouteProps<T, RoutePath>) {
  const [session] = useSessionContext();

  if (!session) {
    return <Redirect to={paths.login} />;
  }

  return <Route {...props} />;
}
