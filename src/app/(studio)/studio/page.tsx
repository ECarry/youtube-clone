import { HydrateClient, trpc } from "@/trpc/server";
import StudioView from "@/modules/studio/ui/views/studio-view";
import { DEFAULT_LIMIT } from "@/constants";

const page = async () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default page;
