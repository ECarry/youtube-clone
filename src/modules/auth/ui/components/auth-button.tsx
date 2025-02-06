import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

export const AuthButton = () => {
  return (
    <Button
      variant="outline"
      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-500 border-blue-500/70 rounded-full shadow-none [&_svg]:size-4"
    >
      <UserCircleIcon />
      Sign in
    </Button>
  );
};
