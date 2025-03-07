import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const VideoReactions = () => {
  const viewerReaction: "like" | "dislike" = "like";

  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUp
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {111}
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="secondary"
        className="rounded-r-full rounded-l-none pl-3"
      >
        <ThumbsDown
          className={cn("size-5", viewerReaction !== "like" && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
};
