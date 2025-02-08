import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
