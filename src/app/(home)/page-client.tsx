"use client";

import { trpc } from "@/trpc/client";

const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "你好👋" });

  return <div>PageClient {data.greeting}</div>;
};

export default PageClient;
