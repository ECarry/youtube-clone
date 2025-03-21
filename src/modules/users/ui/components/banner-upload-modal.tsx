import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BannerUploadModal = ({
  userId,
  open,
  onOpenChange,
}: BannerUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });
    onOpenChange(false);
  };
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload a Banner"
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
