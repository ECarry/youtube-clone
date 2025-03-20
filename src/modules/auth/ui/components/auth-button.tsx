"use client";

import { signOut, useSession } from "@/modules/auth/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Loader2,
  UserCircleIcon,
  ClapperboardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthButton = () => {
  const router = useRouter();
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button
        variant="outline"
        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-500 border-blue-500/70 rounded-full shadow-none [&_svg]:size-4"
        onClick={() => router.push("/sign-in")}
      >
        <UserCircleIcon />
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 hover:opacity-80 transition-opacity cursor-pointer">
          <AvatarImage
            src={session.user.image || "#"}
            alt="Avatar"
            className="object-cover"
          />
          <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <button
            className="w-full"
            onClick={() => router.push(`/users/${session.user.id}`)}
          >
            <span className="text-sm">
              <div className="flex items-center gap-2">
                <UserCircleIcon className="size-4" />
                My Profile
              </div>
            </span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="w-full" onClick={() => router.push("/studio")}>
            <span className="text-sm">
              <div className="flex items-center gap-2">
                <ClapperboardIcon className="size-4" />
                Studio
              </div>
            </span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className="w-full"
            onClick={async () => {
              setIsSignOut(true);
              await signOut({
                fetchOptions: {
                  onSuccess() {
                    router.push("/");
                  },
                },
              });
              setIsSignOut(false);
            }}
            disabled={isSignOut}
          >
            <span className="text-sm">
              {isSignOut ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <LogOut size={16} />
                  Sign Out
                </div>
              )}
            </span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
