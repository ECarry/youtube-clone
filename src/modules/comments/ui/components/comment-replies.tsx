import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { CornerDownRight, Loader2 } from "lucide-react";
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";

interface CommentRepliesProps {
  parentId: string;
  videoId: string;
}

export const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        parentId,
        videoId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin size-6 text-muted-foreground" />
          </div>
        )}
        {data?.pages.map((page, index) => (
          <div key={index}>
            {page.items.map((comment) => (
              <CommentItem key={comment.id} comment={comment} variant="reply" />
            ))}
          </div>
        ))}
      </div>
      {hasNextPage && (
        <Button
          variant="link"
          size="sm"
          className="text-blue-500"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <CornerDownRight className="mr-2 h-4 w-4" />
          Show More
        </Button>
      )}
    </div>
  );
};
