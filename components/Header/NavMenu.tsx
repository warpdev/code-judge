"use client";
import { twJoin, twMerge } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/constants/common";
import Link from "next/link";
import { Session } from "next-auth";
import { useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { Badge } from "@/components/BaseComponents";

const baseLinkStyle = twJoin(
  roundButton,
  "transition",
  "hover:text-neutral-950 dark:hover:text-neutral-50",
);

const NavMenu = ({ user }: { user?: Session["user"] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("header");
  const pathname = usePathname();

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
            {NAV_LINKS.map((link) =>
              (!link.requiredAuth && !link.onlyNoAuth) ||
              (user && !link.onlyNoAuth) ||
              (!user && link.onlyNoAuth) ? (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={twMerge(
                      baseLinkStyle,
                      pathname === link.href
                        ? "font-bold text-neutral-950 dark:text-neutral-50"
                        : "text-neutral-400 dark:text-neutral-500",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{t(link.name as any)}</span>
                    {link.isNew && (
                      <Badge className="ml-1 inline bg-sky-500 text-sky-500">
                        New!
                      </Badge>
                    )}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </nav>
      </RemoveScroll>
    </div>
  );
};

export default NavMenu;
