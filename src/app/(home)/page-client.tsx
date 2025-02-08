"use client";

import { trpc } from "@/trpc/client";
import { useAuth } from "@clerk/nextjs";

const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "你好👋" });
  const { userId } = useAuth();

  return (
    <div>
      PageClient {data.greeting} {userId}
    </div>
  );
};

export default PageClient;
