import { useSession } from "@/features/auth";
import { User } from "@/types";

export function useIsCreatedByUser<T extends { createdBy: User }>(
  params: T | undefined
) {
  const [session] = useSession();

  if (!params) {
    return false;
  }

  return params.createdBy.id === session.user.id;
}
