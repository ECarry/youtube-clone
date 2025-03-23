import { PlaylistGetManyOutput } from "@/modules/playlists/types";
import Link from "next/link";
import {
  PlaylistThumbnail,
  PlaylistThumbnailSkeleton,
} from "./playlist-thumbnail";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { PlaylistInfo, PlaylistInfoSkeleton } from "./playlist-info";

interface Props {
  playlist: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};

export const PlaylistGridCard = ({ playlist }: Props) => {
  return (
    <Link prefetch href={`/playlists/${playlist.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          title={playlist.name}
          videoCount={playlist.videoCount}
          imageUrl={playlist.thumbnailUrl || THUMBNAIL_FALLBACK}
        />
        <PlaylistInfo data={playlist} />
      </div>
    </Link>
  );
};
