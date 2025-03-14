"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer } from "../components/video-player";
import { VideoBanner } from "../components/video-banner";
import { VideoTopRow } from "../components/video-top-row";
import useUser from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  videoId: string;
}

export const VideoSection = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <div className="aspect-video bg-black rounded-xl overflow-hidden relative" />
      <div className="flex flex-col gap-4 mt-4">
        <Skeleton className="h-10 w-40" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
            <Skeleton className="h-10 w-40 rounded-l-full rounded-r-full" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    </>
  );
};

const VideoSectionSuspense = ({ videoId }: Props) => {
  const { userId } = useUser();

  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
  });

  const handlePlay = () => {
    if (!userId) return;

    createView.mutate({
      videoId,
    });
  };

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
