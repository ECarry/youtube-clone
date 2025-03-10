import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        creatorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { creatorId } = input;
      const { user } = ctx;

      if (creatorId === user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [subscription] = await db
        .insert(subscriptions)
        .values({
          viewerId: user.id,
          creatorId,
        })
        .returning();

      return subscription;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        creatorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { creatorId } = input;
      const { user } = ctx;

      if (creatorId === user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [deleteSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.creatorId, creatorId),
            eq(subscriptions.viewerId, user.id)
          )
        )
        .returning();

      return deleteSubscription;
    }),
});
