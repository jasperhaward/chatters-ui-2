import { useLocation } from "wouter";
import styles from "./RegisterPage.module.scss";

import config from "../../config";
import { useRegister } from "../../api";
import { paths } from "../../App";
import {
  Input,
  Panel,
  Button,
  Spinner,
  ErrorMessage,
  FixedElement,
  Link,
} from "../../components";
import { useForm, ValidationRules } from "../../hooks";

interface RegisterInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const initialInputs: RegisterInputs = {
  username: "",
  password: "",
  confirmPassword: "",
};

const validation: ValidationRules<RegisterInputs> = {
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
  const [_location, setLocation] = useLocation();
  const { isLoading, error, mutate } = useRegister();
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
      const result = await mutate(inputs);

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
            disabled={isLoading}
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
            disabled={isLoading}
            value={inputs.password}
            onInput={onInput}
          />
          {hasSubmitted && errors?.password && (
            <ErrorMessage>{errors.password}</ErrorMessage>
          )}
          <Input
            placeholder="Confirm password"
            type="password"
            name="confirmPassword"
            disabled={isLoading}
            value={inputs.confirmPassword}
            onInput={onInput}
          />
          {hasSubmitted && errors?.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}
          {error && <ErrorMessage>{error.message}</ErrorMessage>}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner />} Create account
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
