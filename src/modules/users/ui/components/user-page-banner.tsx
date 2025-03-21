import { cn } from "@/lib/utils";
import { UserGetOneOutPut } from "../../types";
import useUser from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { BannerUploadModal } from "./banner-upload-modal";

interface UserPageBannerProps {
  user: UserGetOneOutPut;
}

export const UserPageBannerSkeleton = () => {
  return <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh]" />;
};

export const UserPageBanner = ({ user }: UserPageBannerProps) => {
  const { userId } = useUser();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative group">
      <BannerUploadModal userId={user.id} open={open} onOpenChange={setOpen} />
      <div
        className={cn(
          "w-full max-h-[200px] h-[15vh] md:h-[25vh] bg-gradient-to-r from-gray-100 to-gray-200",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {mounted && userId === user.id && (
          <Button
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            type="button"
            onClick={() => setOpen(true)}
          >
            <Edit2Icon className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};
