import { useSession } from "@/modules/auth/lib/auth-client";

const useUser = () => {
  const { data: session } = useSession();

  return {
    userId: session?.session.id,
    user: session?.user,
  };
};

export default useUser;
