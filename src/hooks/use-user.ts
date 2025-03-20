import { useSession } from "@/modules/auth/lib/auth-client";
import type { Session } from "@/modules/auth/lib/auth-types";
import { BetterFetchError } from "@better-fetch/fetch";

type UserHookReturn = {
  userId: string | undefined;
  user: Session["user"] | undefined;
  isAuthenticated: boolean;
  error: BetterFetchError | null;
};

/**
 * Custom hook to access and manage user data
 *
 * @returns User data, authentication state, and auth methods
 */
const useUser = (): UserHookReturn => {
  const { data: session, error } = useSession();

  const isAuthenticated = !!session?.user;

  return {
    userId: session?.user?.id,
    user: session?.user,
    isAuthenticated,
    error,
  };
};

export default useUser;
