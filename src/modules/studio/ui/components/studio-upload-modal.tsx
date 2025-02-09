"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();

      toast.success("Video created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Button
      disabled={create.isPending}
      onClick={() => create.mutate()}
      variant="secondary"
      className="flex items-center gap-1"
    >
      {create.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon />
      )}
      Create
    </Button>
  );
};
