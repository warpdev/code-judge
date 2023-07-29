import { BaseProps } from "@/types/common";
import { twMerge } from "tailwind-merge";

const Skeleton = ({ className }: BaseProps) => {
  return (
    <div
      className={twMerge(
        "animate-pulse rounded",
        "bg-neutral-300 dark:bg-neutral-800",
        className,
      )}
    />
  );
};

export default Skeleton;
