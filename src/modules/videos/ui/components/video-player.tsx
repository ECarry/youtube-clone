"use client";

import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null;
  thumbnailUrl?: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
}
export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  if (!playbackId) return null;

  return (
    <MuxPlayer
      playbackId={playbackId}
      poster={thumbnailUrl || "/placeholder.svg"}
      autoPlay={autoPlay}
      playerInitTime={0}
      thumbnailTime={0}
      className="size-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
    />
  );
};
