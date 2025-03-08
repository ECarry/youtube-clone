import { useSession } from "@/modules/auth/lib/auth-client";

const useUserId = () => {
  const { data: session } = useSession();
  return session?.user?.id;
};

export default useUserId;
