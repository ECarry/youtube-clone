import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingVideoReactionLike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, "like")
          )
        );

      if (existingVideoReactionLike) {
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.type, "like")
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [newVideoReaction] = await db
        .insert(videoReactions)
        .values({
          videoId,
          userId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: {
            type: "like",
          },
        })
        .returning();

      return newVideoReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingVideoReactionDislike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, "dislike")
          )
        );

      if (existingVideoReactionDislike) {
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.type, "dislike")
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [newVideoReaction] = await db
        .insert(videoReactions)
        .values({
          videoId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return newVideoReaction;
    }),
});
