import { Session } from "@/features/auth";
import { useFetch } from "./useFetch";
import { useMutation } from "./useMutation";

export interface LoginParams {
  username: string;
  password: string;
}

export function useLogin() {
  const fetch = useFetch();
  const url = "/api/v1/auth/login";

  return useMutation((params: LoginParams) =>
    fetch<Session>(url, {
      method: "POST",
      body: params,
    })
  );
}
