import { BaseProps } from "@/types/common";
import { twJoin } from "tailwind-merge";
import { LogoIcon } from "@/components/Icons";

const AppLogo = ({ className }: BaseProps) => {
  return (
    <span
      className={twJoin(
        "min-w-max select-none font-black text-neutral-700 md:text-2xl",
        "flex items-center",
        "text-md",
        "dark:text-neutral-300",
        className,
      )}
    >
      <LogoIcon />
      <span className="min-w-max">Code Start</span>
    </span>
  );
};

export default AppLogo;
