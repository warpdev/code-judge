//TODO: move to json
import Link from "next/link";
import { twJoin } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { getServerSession } from "next-auth";
import UserHeaderPanel from "@/components/Header/UserHeaderPanel";
import AppLogo from "@/components/AppLogo";
import { getServerUser } from "@/utils/serverUtils";

const LINK = [
  {
    name: "Problems",
    href: "/problems",
  },
  {
    name: "Submissions",
    href: "/submissions",
  },
];

const HeaderBar = async () => {
  const user = await getServerUser();

  return (
    <header className="flex w-full justify-between px-2 py-4 shadow-lg">
      <Link href="/">
        <AppLogo />
      </Link>
      <nav>
        <ul className="flex gap-2">
          {LINK.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={twJoin(roundButton, actionNeutral)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <UserHeaderPanel user={user} />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderBar;
