import { UserWithCreatedAt } from "@/types";
import { useFetch } from "./useFetch";
import { useMutation } from "./useMutation";

export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
}

export function useRegister() {
  const fetch = useFetch();
  const url = "/api/v1/auth/register";

  return useMutation((params: RegisterParams) =>
    fetch<UserWithCreatedAt>(url, {
      method: "POST",
      body: params,
    })
  );
}
