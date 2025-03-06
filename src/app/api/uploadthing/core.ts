import { db } from "@/db";
import { user, videos } from "@/db/schema";
import { auth } from "@/modules/auth/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ videoId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      const userId = session?.user?.id;

      if (!userId) throw new UploadThingError("Unauthorized");

      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!existingUser) throw new UploadThingError("Unauthorized");

      const [existingVideo] = await db
        .select({ thumbnailKey: videos.thumbnailKey })
        .from(videos)
        .where(
          and(eq(videos.id, input.videoId), eq(videos.userId, existingUser.id))
        );

      if (!existingVideo) throw new UploadThingError("Not found");

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);

        await db
          .update(videos)
          .set({ thumbnailKey: null })
          .where(
            and(
              eq(videos.id, input.videoId),
              eq(videos.userId, existingUser.id)
            )
          );
      }

      return { user: existingUser, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
        .set({
          thumbnailUrl: file.ufsUrl,
          thumbnailKey: file.key,
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.user.id)
          )
        );

      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
