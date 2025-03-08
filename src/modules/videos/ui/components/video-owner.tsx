import Link from "next/link";
import { VideoGetOneOutPut } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/modules/auth/lib/auth-client";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";

interface Props {
  user: VideoGetOneOutPut["user"];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: Props) => {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === user.id;

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar
            imageUrl={user.image ?? ""}
            name={user.name ?? "User"}
            size="lg"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo name={user.name} size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {0} subscribers
            </span>
          </div>
        </div>
      </Link>
      {isOwner ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={() => {}}
          disabled={false}
          isSubscribed={false}
          className="flex-none"
        />
      )}
    </div>
  );
};
