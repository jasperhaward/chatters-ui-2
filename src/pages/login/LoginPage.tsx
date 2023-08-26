import { useContext } from "preact/hooks";
import styles from "./LoginPage.module.scss";

import { useLogin } from "@/api";
import { paths } from "@/App";
import { SessionContext } from "@/context";
import { ValidationRules, useForm } from "@/hooks";
import {
  Button,
  Spinner,
  ErrorMessage,
  FixedElement,
  Input,
  Panel,
  Link,
} from "@/components";

interface LoginInputs {
  username: string;
  password: string;
}

const validation: ValidationRules<LoginInputs> = {
  username: (value) => (value === "" ? "Required" : null),
  password: (value) => (value === "" ? "Required" : null),
};

export default function LoginPage() {
  const [session, setSession] = useContext(SessionContext);
  const login = useLogin();
  // prettier-ignore
  const { 
    inputs, 
    hasErrors, 
    errors, 
    hasSubmitted, 
    onInput,
    setHasSubmitted 
  } = useForm(defaultInputs(), validation);

  async function onLoginSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();

    setHasSubmitted(true);

    if (!hasErrors) {
      const result = await login.mutate(inputs);

      if (result.data) {
        // setting the session will automatically redirect the user to the conversations page
        setSession(result.data);
      }
    }
  }

  function defaultInputs(): LoginInputs {
    const url = new URL(`${document.location}`);

    return {
      username: url.searchParams.get("username") || "",
      password: "",
    };
  }

  return (
    <main className={styles.login}>
      <Panel minWidth={1200}>Hello world.</Panel>
      <form className={styles.form} onSubmit={onLoginSubmit}>
        <h2>Login</h2>
        <p>Enter your username and password below to login</p>
        <div className={styles.inputs}>
          <Input
            placeholder="Username"
            type="text"
            name="username"
            disabled={login.isLoading}
            value={inputs.username}
            onInput={onInput}
          />
          {hasSubmitted && errors?.username && (
            <ErrorMessage>{errors.username}</ErrorMessage>
          )}
          <Input
            placeholder="Password"
            type="password"
            name="password"
            disabled={login.isLoading}
            value={inputs.password}
            onInput={onInput}
          />
          {hasSubmitted && errors?.password && (
            <ErrorMessage>{errors.password}</ErrorMessage>
          )}
          {login.error && <ErrorMessage>{login.error.message}</ErrorMessage>}
          <Button type="submit" color="contrast" disabled={login.isLoading}>
            {login.isLoading && <Spinner />} Login
          </Button>
        </div>
      </form>
      <FixedElement position="topRight">
        <Link color="ghost" to={paths.index}>
          Register
        </Link>
      </FixedElement>
    </main>
  );
}
