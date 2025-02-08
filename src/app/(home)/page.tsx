import { HydrateClient, trpc } from "@/trpc/server";
import PageClient from "./page-client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  void trpc.hello.prefetch({ text: "你好👋" });
  const { userId } = await auth();

  console.log({ userId });

  return (
    <>
      <h1>Home</h1>
      <p>userId: {userId}</p>
      <HydrateClient>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <PageClient />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </>
  );
}
