import { HydrateClient, trpc } from "@/trpc/server";
import { PlaylistView } from "@/modules/playlists/ui/views/playlist-view";
import { DEFAULT_LIMIT } from "@/constants";

export const dynamic = "force-dynamic";

const page = () => {
  void trpc.playlists.getMany.prefetchInfinite({
    cursor: null,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <PlaylistView />
    </HydrateClient>
  );
};

export default page;
