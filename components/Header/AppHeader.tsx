//TODO: move to json
import Link from "next/link";
import AppLogo from "@/components/AppLogo";
import { getServerUser } from "@/utils/serverUtils";
import NavMenu from "@/components/Header/NavMenu";

const HeaderBar = async () => {
  const user = await getServerUser();

  return (
    <header className="relative flex h-16 w-full items-center justify-between bg-white px-2 shadow-lg md:h-20">
      <Link href="/">
        <AppLogo />
      </Link>
      <NavMenu user={user} />
    </header>
  );
};

export default HeaderBar;
