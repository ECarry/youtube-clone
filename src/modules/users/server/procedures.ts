import { z } from "zod";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { subscriptions, user, videos } from "@/db/schema";
import { eq, getTableColumns, isNotNull } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usersRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const viewerSubscriptions = db
        .$with("viewer_subscriptions")
        .as(
          db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.viewerId, userId))
        );

      const [existingUser] = await db
        .with(viewerSubscriptions)
        .select({
          ...getTableColumns(user),
          subscriberCount: db.$count(
            subscriptions,
            eq(subscriptions.creatorId, user.id)
          ),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
            Boolean
          ),
          videoCount: db.$count(videos, eq(videos.userId, user.id)),
        })
        .from(user)
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, user.id)
        )
        .where(eq(user.id, input.id));

      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingUser;
    }),
});
