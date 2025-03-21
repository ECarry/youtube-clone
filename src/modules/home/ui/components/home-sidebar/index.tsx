import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import { SubscriptionsSection } from "./subscriptions-section";

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <div className="px-4 w-full">
          <Separator />
        </div>
        <PersonalSection />
        <div className="px-4 w-full">
          <Separator />
        </div>
        <SubscriptionsSection />
      </SidebarContent>
    </Sidebar>
  );
};
