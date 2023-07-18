import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { twJoin } from "tailwind-merge";

const TooltipDemo = ({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span tabIndex={0}>{trigger}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={twJoin(
              "bg-neutral-400 dark:bg-neutral-700",
              "text-neutral-700 dark:text-neutral-300",
              "whitespace-pre-line",
              "rounded-md p-2",
              "animate-slideIn",
            )}
            sideOffset={8}
          >
            {children}
            <Tooltip.Arrow
              className="fill-neutral-400 dark:fill-neutral-700"
              width={16}
              height={8}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipDemo;
