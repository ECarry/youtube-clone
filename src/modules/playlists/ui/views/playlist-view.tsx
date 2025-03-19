"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PlaylistCreateModal } from "@/modules/playlists/ui/components/playlist-create-modal";
import { useState } from "react";
import { PlaylistSection } from "../sections/playlist-section";

export const PlaylistView = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal open={open} onOpenChange={setOpen} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Collections you have created
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setOpen(true)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};
