import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";
import { useSession } from "@/modules/auth/lib/auth-client";

export const StudioSidebarHeader = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { state } = useSidebar();

  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-between pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );

  if (state === "collapsed")
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Your Profile" asChild>
          <Link prefetch href="/users/current">
            <UserAvatar
              imageUrl={user.image ?? ""}
              name={user.name ?? "User"}
              size="xs"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

  return (
    <SidebarHeader className="flex items-center justify-between pb-4">
      <Link prefetch href="/users/current">
        <UserAvatar
          imageUrl={user.image ?? ""}
          name={user.name ?? "User"}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">Your Profile</p>
        <p className="text-xs text-muted-foreground">{user.name}</p>
      </div>
    </SidebarHeader>
  );
};
