import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type UserGetOneOutPut = inferRouterOutputs<AppRouter>["users"]["getOne"];
