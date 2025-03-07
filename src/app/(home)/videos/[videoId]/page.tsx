import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ videoId: string }>;
}

const page = async ({ params }: Props) => {
  const videoId = (await params).videoId;
  void trpc.videos.getOne.prefetch({ id: videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default page;
