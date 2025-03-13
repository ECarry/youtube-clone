import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type CommentsGetManyOutPut =
  inferRouterOutputs<AppRouter>["comments"]["getMany"];
