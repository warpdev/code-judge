import { Lecture } from "@prisma/client";
import { twJoin } from "tailwind-merge";
import { FileText } from "lucide-react";
import { baseCard } from "@/style/baseComponent";
import { BaseProps } from "@/types/common";

const LectureCard = ({
  htmlTag = "div",
  lecture,
  className,
}: BaseProps & {
  htmlTag?: keyof JSX.IntrinsicElements;
  lecture: Lecture;
}) => {
  const HtmlTag = htmlTag as keyof JSX.IntrinsicElements;

  return (
    <HtmlTag
      className={twJoin(baseCard, "group flex items-center gap-3", className)}
    >
      <FileText
        className={twJoin(
          "h-8 w-8 transition duration-300",
          "text-neutral-300 dark:text-neutral-700",
          "group-hover:text-neutral-400 dark:group-hover:text-neutral-600",
        )}
      />
      <div className="flex flex-col gap-1">
        <span>{lecture.title}</span>
        <span className="text-sm text-neutral-500">{lecture.description}</span>
      </div>
    </HtmlTag>
  );
};

export default LectureCard;
