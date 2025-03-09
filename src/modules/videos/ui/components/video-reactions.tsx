import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import { VideoGetOneOutPut } from "../../types";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface Props {
  videoId: string;
  likeCount: number;
  dislikeCount: number;
  viewerReaction: VideoGetOneOutPut["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likeCount,
  dislikeCount,
  viewerReaction,
}: Props) => {
  const utils = trpc.useUtils();
  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You need to be logged in to like this video");
        return;
      }
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You need to be logged in to dislike this video");
        return;
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUp
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likeCount}
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-r-full rounded-l-none pl-3"
      >
        <ThumbsDown
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikeCount}
      </Button>
    </div>
  );
};
