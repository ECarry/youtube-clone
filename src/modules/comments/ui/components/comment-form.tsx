import { UserAvatar } from "@/components/user-avatar";
import useUser from "@/hooks/use-user";
import { Button } from "react-day-picker";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const { user } = useUser();

  const onSubmit = () => {
    onSuccess?.();
  };

  return (
    <form className="flex gap-4 group" onSubmit={onSubmit}>
      <UserAvatar
        size="lg"
        imageUrl={user?.image || ""}
        name={user?.name || ""}
      />
      {videoId}
      <Button type="submit">Post</Button>
    </form>
  );
};
