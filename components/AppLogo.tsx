import { BaseProps } from "@/types/common";
import { twJoin } from "tailwind-merge";

const AppLogo = ({ className }: BaseProps) => {
  return (
    <span
      className={twJoin(
        "min-w-max select-none font-black text-neutral-800 md:text-2xl",
        "text-md",
        className
      )}
    >
      Code Start
    </span>
  );
};

export default AppLogo;
