import { HomeLayout } from "@/modules/home/ui/home-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
