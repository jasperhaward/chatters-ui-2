import { useLocation } from "wouter-preact";
import styles from "./RegisterPage.module.scss";

import config from "@/config";
import { useRegister } from "@/api";
import { paths } from "@/App";
import { useForm, ValidationRules } from "@/hooks";
import {
  Input,
  Panel,
  Button,
  ErrorMessage,
  FixedElement,
  Link,
} from "@/components";

const initialInputs = {
  username: "",
  password: "",
  confirmPassword: "",
};

const validation: ValidationRules<typeof initialInputs> = {
  username: (value) =>
    value === ""
      ? "Required"
      : value.length < config.minUsernameLength
      ? `Must contain at least ${config.minUsernameLength} characters`
      : value.length > config.maxUsernameLength
      ? `Must contain less than ${config.maxUsernameLength + 1} characters`
      : null,
  password: (value) =>
    value === ""
      ? "Required"
      : value.length < config.minPasswordLength
      ? `Must contain at least ${config.minPasswordLength} characters`
      : value.length > config.maxPasswordLength
      ? `Must contain less than ${config.maxPasswordLength + 1} characters`
      : null,
  confirmPassword: (value, inputs) =>
    value === ""
      ? "Required"
      : value !== inputs.password
      ? "Passwords do not match"
      : null,
};

export default function RegisterPage() {
  const [location, setLocation] = useLocation();
  const register = useRegister();
  // prettier-ignore
  const { 
    inputs, 
    hasErrors, 
    errors, 
    hasSubmitted, 
    onInput,
    setHasSubmitted 
  } = useForm(initialInputs, validation);

  async function onRegisterSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();

    setHasSubmitted(true);

    if (!hasErrors) {
      const result = await register.execute(inputs);

      if (result.data) {
        setLocation(`${paths.login}?username=${result.data.username}`);
      }
    }
  }

  return (
    <main className={styles.register}>
      <Panel minWidth={1200}>Hello world.</Panel>
      <form className={styles.form} onSubmit={onRegisterSubmit}>
        <h2>Create an account</h2>
        <p>Enter your details below to create your account</p>
        <div className={styles.inputs}>
          <Input
            placeholder="Username"
            type="text"
            name="username"
            disabled={register.isLoading}
            value={inputs.username}
            onInput={onInput}
          />
          {hasSubmitted && errors.username && (
            <ErrorMessage>{errors.username}</ErrorMessage>
          )}
          <Input
            placeholder="Password"
            type="password"
            name="password"
            disabled={register.isLoading}
            value={inputs.password}
            onInput={onInput}
          />
          {hasSubmitted && errors.password && (
            <ErrorMessage>{errors.password}</ErrorMessage>
          )}
          <Input
            placeholder="Confirm password"
            type="password"
            name="confirmPassword"
            disabled={register.isLoading}
            value={inputs.confirmPassword}
            onInput={onInput}
          />
          {hasSubmitted && errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}
          {register.error && (
            <ErrorMessage>{register.error.message}</ErrorMessage>
          )}
          <Button
            className={styles.createAccount}
            type="submit"
            color="foreground"
            disabled={register.isLoading}
            spinner={register.isLoading}
          >
            Create account
          </Button>
        </div>
      </form>
      <FixedElement position="topRight">
        <Link color="ghost" to={paths.login}>
          Login
        </Link>
      </FixedElement>
    </main>
  );
}
