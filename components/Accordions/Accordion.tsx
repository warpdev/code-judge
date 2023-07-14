"use client";
import { twJoin, twMerge } from "tailwind-merge";
import { ChevronDownIcon } from "lucide-react";
import {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps,
  Content,
  Header,
  Item,
  Root,
  Trigger,
} from "@radix-ui/react-accordion";
import { RootProps } from "postcss";

const AccordionItem = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & AccordionItemProps) => (
  <Item
    className={twMerge(
      "mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-neutral-900",
      className,
    )}
    {...props}
  >
    {children}
  </Item>
);

const AccordionTrigger = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & AccordionTriggerProps) => (
  <Header className="flex">
    <Trigger
      className={twMerge(
        "group flex h-[45px] flex-1 cursor-default items-center justify-between bg-neutral-50 px-5 text-[15px] leading-none outline-none hover:bg-neutral-200",
        "dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
        "transition",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className={twJoin(
          "text-neutral-800 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180",
          "dark:text-neutral-300",
        )}
        aria-hidden
      />
    </Trigger>
  </Header>
);

const AccordionContent = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & AccordionContentProps) => (
  <Content
    className={twMerge(
      "overflow-hidden bg-neutral-100 text-[15px] text-neutral-800 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
      "dark:bg-neutral-900 dark:text-neutral-300",
      className,
    )}
    {...props}
  >
    <div className="px-5 py-[15px]">{children}</div>
  </Content>
);

//TODO: use my design
const Accordion = ({
  contents,
  ...props
}: {
  contents: {
    title: string;
    content: React.ReactNode | string;
  }[];
  className?: string;
} & RootProps) => (
  <Root type="single" defaultValue="item-1" collapsible {...props}>
    {contents.map(({ title, content }, index) => (
      <AccordionItem key={index} value={`item-${index + 1}`}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    ))}
  </Root>
);

export default Accordion;
