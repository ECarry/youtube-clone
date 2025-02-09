import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
