"use client";
import { twJoin, twMerge } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/constants/common";
import Link from "next/link";
import UserHeaderPanel from "@/components/Header/UserHeaderPanel";
import { Session } from "next-auth";
import { useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { useTranslations } from "next-intl";

const NavMenu = ({ user }: { user?: Session["user"] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("header");
  return (
    <div>
      <RemoveScroll enabled={isMenuOpen}>
        <button
          className={twMerge(roundButton, actionNeutral, "p-1", "md:hidden")}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <nav
          className={twJoin(
            "absolute left-0 right-0 top-full z-10",
            "md:relative",
            "bg-white dark:bg-neutral-900",
            "h-screen md:h-auto",
            "shadow-lg md:shadow-none",
            isMenuOpen ? "block" : "hidden",
            "md:block",
          )}
        >
          <ul
            className={twJoin(
              "flex gap-2",
              "flex-col md:flex-row",
              "items-end md:items-start",
            )}
          >
            {user && (
              <li key="my-problems">
                <Link
                  href="/my-problems"
                  className={twJoin(roundButton, actionNeutral)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("myProblems")}
                </Link>
              </li>
            )}
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={twJoin(roundButton, actionNeutral)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(link.name as any)}
                </Link>
              </li>
            ))}
            <li onClick={() => setIsMenuOpen(false)}>
              <UserHeaderPanel user={user} />
            </li>
          </ul>
        </nav>
      </RemoveScroll>
    </div>
  );
};

export default NavMenu;
