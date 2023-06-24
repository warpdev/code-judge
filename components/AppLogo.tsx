import { BaseProps } from "@/types/common";
import { twJoin } from "tailwind-merge";

const AppLogo = ({ className }: BaseProps) => {
  return (
    <span
      className={twJoin(
        "min-w-max select-none text-2xl font-black text-neutral-800",
        className
      )}
    >
      Code Start
    </span>
  );
};

export default AppLogo;
