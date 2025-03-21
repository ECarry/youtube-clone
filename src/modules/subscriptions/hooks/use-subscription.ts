import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Subscribed");
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: userId });
      utils.subscriptions.getMany.invalidate();

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You need to be logged in to subscribe");
        return;
      }
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success("Unsubscribed");
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: userId });
      utils.subscriptions.getMany.invalidate();

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You need to be logged in to unsubscribe");
        return;
      }
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ creatorId: userId });
    } else {
      subscribe.mutate({ creatorId: userId });
    }
  };

  return {
    isPending,
    onClick,
  };
};
