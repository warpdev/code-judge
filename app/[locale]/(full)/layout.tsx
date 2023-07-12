import "@/app/globals.css";
import "@/style/prosemirror.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto h-screen w-full px-2 py-4 md:px-10">
      {children}
    </main>
  );
};

export default Layout;
