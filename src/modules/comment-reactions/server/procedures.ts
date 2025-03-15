import { db } from "@/db";
import { commentsReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentReactionLike] = await db
        .select()
        .from(commentsReactions)
        .where(
          and(
            eq(commentsReactions.commentId, commentId),
            eq(commentsReactions.userId, userId),
            eq(commentsReactions.type, "like")
          )
        );

      if (existingCommentReactionLike) {
        const [deletedViewerReaction] = await db
          .delete(commentsReactions)
          .where(
            and(
              eq(commentsReactions.userId, userId),
              eq(commentsReactions.commentId, commentId),
              eq(commentsReactions.type, "like")
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [newCommentReaction] = await db
        .insert(commentsReactions)
        .values({
          commentId,
          userId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [commentsReactions.commentId, commentsReactions.userId],
          set: {
            type: "like",
          },
        })
        .returning();

      return newCommentReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentReactionDislike] = await db
        .select()
        .from(commentsReactions)
        .where(
          and(
            eq(commentsReactions.commentId, commentId),
            eq(commentsReactions.userId, userId),
            eq(commentsReactions.type, "dislike")
          )
        );

      if (existingCommentReactionDislike) {
        const [deletedViewerReaction] = await db
          .delete(commentsReactions)
          .where(
            and(
              eq(commentsReactions.userId, userId),
              eq(commentsReactions.commentId, commentId),
              eq(commentsReactions.type, "dislike")
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [newCommentReaction] = await db
        .insert(commentsReactions)
        .values({
          commentId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [commentsReactions.commentId, commentsReactions.userId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return newCommentReaction;
    }),
});
