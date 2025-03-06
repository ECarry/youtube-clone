import { db } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/modules/auth/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { ratelimit } from "@/lib/ratelimit";
import { headers } from "next/headers";
// Types
import type { Session } from "@/modules/auth/lib/auth-types";
import { user } from "@/db/schema";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id ?? null;

  return { userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;

  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, ctx.userId))
    .limit(1);

  if (!existingUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { success } = await ratelimit.limit(existingUser.id);

  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user: existingUser,
    },
  });
});
