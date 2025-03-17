import { DEFAULT_LIMIT } from "@/constants";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    query: string | undefined;
    categoryId: string | undefined;
  };
}

const SearchPage = ({ searchParams }: Props) => {
  const { query, categoryId } = searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({
    query: query,
    categoryId: categoryId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  );
};

export default SearchPage;
