import { db } from "@/db";
import { videos } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { serve } from "@upstash/workflow/nextjs";

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }

    return existingVideo;
  });

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ title: "Updated from background job" })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
