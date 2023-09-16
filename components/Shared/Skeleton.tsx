import { BaseProps } from "@/types/common";
import { twMerge } from "tailwind-merge";

const Skeleton = ({
  className,
  $as = "div",
}: BaseProps & {
  $as?: React.ElementType;
}) => {
  return (
    <$as
      className={twMerge(
        "animate-pulse rounded-lg",
        "bg-ivory-300 dark:bg-neutral-700",
        "h-[1.5em]",
        className,
      )}
    />
  );
};

export default Skeleton;
