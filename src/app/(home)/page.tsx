import { HydrateClient, trpc } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ categoryId?: string }>;
}

const page = async ({ searchParams }: Props) => {
  const categoryId = (await searchParams).categoryId;

  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

export default page;
