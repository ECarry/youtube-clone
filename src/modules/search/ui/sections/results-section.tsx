"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultsSection = (props: Props) => {
  return (
    <Suspense
      // search no caching
      key={`${props.query}-${props.categoryId}`}
      fallback={<div>Loading...</div>}
    >
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <ResultsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ResultsSectionSuspense = ({ query, categoryId }: Props) => {
  const isMobile = useIsMobile();
  const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query: query,
      categoryId: categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-1">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} size="default" />
            ))}
        </div>
      )}

      <InfiniteScroll
        hasNextPage={resultsQuery.hasNextPage}
        fetchNextPage={resultsQuery.fetchNextPage}
        isFetchingNextPage={resultsQuery.isFetchingNextPage}
      />
    </>
  );
};
