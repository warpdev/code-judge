import AppHeader from "@/components/Header/AppHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main className="container mx-auto px-4 py-4 md:py-8">{children}</main>
    </>
  );
};

export default Layout;
