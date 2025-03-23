"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ListIcon } from "lucide-react";

export const LoadingSkeleton = () => {
  return (
    <SidebarMenu>
      {[...Array(5)].map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 rounded-full shrink-0" />
            <Skeleton className="h-4 w-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export const SubscriptionsSection = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarMenu>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            data?.pages
              .flatMap((page) => page.items)
              .map((item) => (
                <SidebarMenuItem key={`${item.creatorId} - ${item.viewerId}`}>
                  <SidebarMenuButton
                    tooltip={item.user.name}
                    asChild
                    isActive={pathname === `/users/${item.user.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      return router.push(`/users/${item.user.id}`);
                    }}
                  >
                    <Link
                      prefetch
                      href={`/users/${item.user.id}`}
                      className="flex items-center gap-4"
                    >
                      <UserAvatar
                        size="sm"
                        imageUrl={item.user.image || "/user-placeholder.svg"}
                        name={item.user.name}
                      />
                      <span className="text-sm">{item.user.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
          )}
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/subscriptions"}
                asChild
              >
                <Link
                  prefetch
                  href="/subscriptions"
                  className="flex items-center gap-4"
                >
                  <ListIcon className="size-4" />
                  <span className="text-sm">All subscriptions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
