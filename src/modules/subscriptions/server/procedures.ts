import { db } from "@/db";
import { subscriptions, user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
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
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            creatorId: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(subscriptions),
          user: {
            ...getTableColumns(user),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, user.id)
            ),
          },
        })
        .from(subscriptions)
        .innerJoin(user, eq(subscriptions.creatorId, user.id))
        .where(
          and(
            eq(subscriptions.viewerId, userId),
            cursor
              ? or(
                  lt(subscriptions.updatedAt, cursor.updatedAt),
                  and(
                    eq(subscriptions.updatedAt, cursor.updatedAt),
                    lt(subscriptions.creatorId, cursor.creatorId)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(subscriptions.updatedAt), desc(subscriptions.creatorId))
        // Add 1 to the limit to check if there are more data
        .limit(limit + 1);

      const hasMore = data.length > limit;
      // Remove the last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            creatorId: lastItem.creatorId,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return { items, nextCursor };
    }),
});
