import Link from "next/link";
import AppLogo from "@/components/AppLogo";
import { getServerUser } from "@/utils/serverUtils";
import NavMenu from "@/components/Header/NavMenu";
import { twJoin } from "tailwind-merge";

const HeaderBar = async () => {
  const user = await getServerUser();

  return (
    <header
      className={twJoin(
        "relative flex h-16 w-full items-center justify-between border-b px-2 md:h-20",
        "border-neutral-200",
        "dark:border-neutral-800 dark:bg-neutral-900",
      )}
    >
      <Link
        href="/"
        className="transition dark:hover:opacity-80 dark:active:opacity-70"
      >
        <AppLogo />
      </Link>
      <NavMenu user={user} />
    </header>
  );
};

export default HeaderBar;
