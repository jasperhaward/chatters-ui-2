import { useSession } from "@/features/auth";
import { User } from "@/types";

export function useIsCreatedByUser<T extends { createdBy: User }>(params: T) {
  const [session] = useSession();

  return params.createdBy.id === session.user.id;
}
