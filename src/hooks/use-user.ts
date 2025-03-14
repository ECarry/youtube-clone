import { useSession } from "@/modules/auth/lib/auth-client";

const useUser = () => {
  const { data: session } = useSession();

  return {
    userId: session?.session.userId,
    user: session?.user,
  };
};

export default useUser;
