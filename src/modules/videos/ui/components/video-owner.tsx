"use client";

import Link from "next/link";
import { VideoGetOneOutPut } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import useUser from "@/hooks/use-user";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { useEffect, useState } from "react";

interface Props {
  user: VideoGetOneOutPut["user"];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: Props) => {
  const { userId } = useUser();
  const isOwner = userId === user.id;
  const [mounted, setMounted] = useState(false);

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  // Only show the client-side rendered content after hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link prefetch href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar
            imageUrl={user.image ?? ""}
            name={user.name ?? "User"}
            size="lg"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo name={user.name} size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {mounted ? (
        isOwner ? (
          <Button variant="secondary" className="rounded-full" asChild>
            <Link prefetch href={`/studio/videos/${videoId}`}>
              Edit video
            </Link>
          </Button>
        ) : (
          <SubscriptionButton
            onClick={onClick}
            disabled={isPending}
            isSubscribed={user.viewerSubscribed}
            className="flex-none"
          />
        )
      ) : (
        // Placeholder with roughly the same dimensions
        <div className="h-9 w-24" />
      )}
    </div>
  );
};
