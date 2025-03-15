import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListPlus, MoreVertical, ShareIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

export const VideoMenu = ({ videoId, variant, onRemove }: Props) => {
  const onShare = () => {
    const fullUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Video URL copied to clipboard");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="rounded-full">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={onShare}>
          <ShareIcon className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <ListPlus className="mr-2 size-4" />
          Add to playlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRemove}>
          <Trash2Icon className="mr-2 size-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
