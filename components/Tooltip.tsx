import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { twJoin } from "tailwind-merge";

const animateMap = {
  top: "animate-slideInTop",
  bottom: "animate-slideInBottom",
  left: "animate-slideInLeft",
  right: "animate-slideInRight",
};

const TooltipDemo = ({
  side = "top",
  trigger,
  children,
  includeWrapper = true,
}: {
  side?: "top" | "bottom" | "left" | "right";
  trigger: React.ReactNode;
  children: React.ReactNode;
  includeWrapper?: boolean;
}) => {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {includeWrapper ? <span tabIndex={0}>{trigger}</span> : trigger}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={twJoin(
              "bg-neutral-300 dark:bg-neutral-700",
              "text-neutral-700 dark:text-neutral-300",
              "whitespace-pre-line",
              "rounded-md p-2",
              animateMap[side],
            )}
            sideOffset={8}
            side={side}
          >
            {children}
            <Tooltip.Arrow
              className="fill-neutral-300 dark:fill-neutral-700"
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
