import { violetButton } from "@/style/baseComponent";
import { BaseProps } from "@/types/common";
import { twMerge } from "tailwind-merge";
import { PlusCircle } from "lucide-react";
import Link from "next-intl/link";

const AddButton = ({
  href,
  className,
  buttonText,
}: BaseProps & {
  href: string;
  buttonText: string;
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        violetButton,
        "dark:bg-neutral-800",
        "dark:hover:bg-neutral-600",
        className,
      )}
    >
      <PlusCircle className="inline-block h-5 w-5 md:hidden" />
      <span className="hidden md:inline">{buttonText}</span>
    </Link>
  );
};

export default AddButton;
