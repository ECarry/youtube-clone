"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { PlusIcon } from "lucide-react";
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
      onClick={() => create.mutate()}
      variant="secondary"
      className="flex items-center gap-1"
    >
      <PlusIcon />
      Create
    </Button>
  );
};
